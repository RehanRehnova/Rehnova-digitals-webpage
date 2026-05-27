"""
form_handler.py
================
Handles two form payload types:
  - "Form Message"  (contact form)
  - "Project Form"  (booking / project brief)

For each submission the module:
  1. Validates required fields.
  2. Sends a formatted HTML email via SMTP (Gmail-compatible by default).
  3. Persists the payload to the matching Supabase table.

Environment variables required (.env file):
  SMTP_HOST         default: smtp.gmail.com
  SMTP_PORT         default: 587
  SMTP_USER         your Gmail address
  SMTP_PASSWORD     your 16-char Google App Password
  RECIPIENT_EMAIL   address that receives the notifications
  SUPABASE_URL      https://<ref>.supabase.co
  SUPABASE_KEY      service-role or anon key

Supabase tables:
  "Form Message"  →  public.contact_messages
  "Project Form"  →  public.project_submissions

Run the SQL block at the bottom of this file once in the Supabase SQL editor.
"""

from __future__ import annotations

import os
import logging
import smtplib
import textwrap
from datetime import datetime, timezone
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

import httpx

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

class Config:
    def __init__(self, overrides: dict[str, str] | None = None):
        src = {**os.environ, **(overrides or {})}
        self.smtp_host:       str = src.get("SMTP_HOST", "smtp.gmail.com")
        self.smtp_port:       int = int(src.get("SMTP_PORT", "587"))
        self.smtp_user:       str = src.get("SMTP_USER", "")
        self.smtp_password:   str = src.get("SMTP_PASSWORD", "")
        self.recipient_email: str = src.get("RECIPIENT_EMAIL", "")
        self.supabase_url:    str = src.get("SUPABASE_URL", "").rstrip("/")
        self.supabase_key:    str = src.get("SUPABASE_KEY", "")

    def validate(self) -> None:
        missing = [
            k for k, v in {
                "SMTP_USER":       self.smtp_user,
                "SMTP_PASSWORD":   self.smtp_password,
                "RECIPIENT_EMAIL": self.recipient_email,
                "SUPABASE_URL":    self.supabase_url,
                "SUPABASE_KEY":    self.supabase_key,
            }.items() if not v
        ]
        if missing:
            raise EnvironmentError(
                f"Missing required environment variables: {', '.join(missing)}"
            )


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------

REQUIRED_FIELDS: dict[str, list[str]] = {
    "Form Message": ["firstName", "lastName", "email", "subject", "message"],
    "Project Form": ["firstName", "lastName", "email", "brief"],
}

SUPABASE_TABLE: dict[str, str] = {
    "Form Message": "contact_messages",
    "Project Form": "project_submissions",
}


def validate_payload(payload: dict[str, Any]) -> None:
    form_type = payload.get("type")
    if form_type not in REQUIRED_FIELDS:
        raise ValueError(
            f"Unknown payload type '{form_type}'. "
            f"Expected one of: {list(REQUIRED_FIELDS)}"
        )
    missing = [f for f in REQUIRED_FIELDS[form_type] if not payload.get(f)]
    if missing:
        raise ValueError(
            f"[{form_type}] Missing required fields: {', '.join(missing)}"
        )


# ---------------------------------------------------------------------------
# Email templates
# ---------------------------------------------------------------------------

_BASE_HTML = """\
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body     {{ font-family: Arial, sans-serif; background:#f4f4f4; margin:0; padding:20px; }}
  .card    {{ background:#fff; border-radius:8px; padding:32px; max-width:600px;
              margin:auto; box-shadow:0 2px 8px rgba(0,0,0,.1); }}
  h2       {{ color:#2d2d2d; margin-top:0; }}
  table    {{ width:100%; border-collapse:collapse; margin-top:16px; }}
  td       {{ padding:10px 12px; border-bottom:1px solid #eee; vertical-align:top; }}
  td.label {{ color:#666; font-size:.85em; width:32%; white-space:nowrap; }}
  td.value {{ color:#222; word-break:break-word; }}
  .footer  {{ margin-top:24px; font-size:.8em; color:#aaa; text-align:center; }}
</style>
</head>
<body>
<div class="card">
  <h2>{title}</h2>
  <table>{rows}</table>
  <div class="footer">Received {submitted_at} UTC</div>
</div>
</body>
</html>"""

_ROW = "<tr><td class='label'>{label}</td><td class='value'>{value}</td></tr>"


def _row(label: str, value: Any) -> str:
    if isinstance(value, list):
        value = ", ".join(str(v) for v in value) if value else "—"
    return _ROW.format(label=label, value=value or "—")


def _fmt_dt(iso: str | None) -> str:
    if not iso:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
    try:
        return (
            datetime.fromisoformat(iso.replace("Z", "+00:00"))
            .strftime("%Y-%m-%d %H:%M")
        )
    except ValueError:
        return iso


def build_contact_email(p: dict[str, Any]) -> tuple[str, str, str]:
    subject = f"[Contact] {p['subject']} — {p['firstName']} {p['lastName']}"
    rows = "".join([
        _row("Name",    f"{p['firstName']} {p['lastName']}"),
        _row("Email",   p["email"]),
        _row("Subject", p["subject"]),
        _row("Message", p["message"]),
    ])
    html = _BASE_HTML.format(
        title="New Contact Message",
        rows=rows,
        submitted_at=_fmt_dt(p.get("submittedAt")),
    )
    plain = textwrap.dedent(f"""
        New Contact Message
        -------------------
        Name:    {p['firstName']} {p['lastName']}
        Email:   {p['email']}
        Subject: {p['subject']}
        Message: {p['message']}
    """).strip()
    return subject, plain, html


def build_project_email(p: dict[str, Any]) -> tuple[str, str, str]:
    subject = (
        f"[Project] {p['firstName']} {p['lastName']} "
        f"— {p.get('company') or 'Independent'}"
    )
    services = p.get("services") or []
    rows = "".join([
        _row("Name",      f"{p['firstName']} {p['lastName']}"),
        _row("Email",     p["email"]),
        _row("Phone",     p.get("phone")),
        _row("Company",   p.get("company")),
        _row("Role",      p.get("role")),
        _row("How Found", p.get("howFound")),
        _row("Services",  services),
        _row("Budget",    p.get("budget")),
        _row("Brief",     p["brief"]),
    ])
    html = _BASE_HTML.format(
        title="New Project Submission",
        rows=rows,
        submitted_at=_fmt_dt(p.get("submittedAt")),
    )
    plain = textwrap.dedent(f"""
        New Project Submission
        ----------------------
        Name:      {p['firstName']} {p['lastName']}
        Email:     {p['email']}
        Phone:     {p.get("phone", "—")}
        Company:   {p.get("company", "—")}
        Role:      {p.get("role", "—")}
        How Found: {p.get("howFound", "—")}
        Services:  {", ".join(services) if services else "—"}
        Budget:    {p.get("budget", "—")}
        Brief:     {p['brief']}
    """).strip()
    return subject, plain, html


# ---------------------------------------------------------------------------
# Email sending
# ---------------------------------------------------------------------------

def send_email(
    cfg: Config,
    subject: str,
    plain: str,
    html: str,
    reply_to: str | None = None,
) -> None:
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = cfg.smtp_user
    msg["To"]      = cfg.recipient_email
    if reply_to:
        msg["Reply-To"] = reply_to

    msg.attach(MIMEText(plain, "plain"))
    msg.attach(MIMEText(html,  "html"))

    with smtplib.SMTP(cfg.smtp_host, cfg.smtp_port, timeout=15) as server:
        server.ehlo()
        server.starttls()
        server.login(cfg.smtp_user, cfg.smtp_password)
        server.sendmail(cfg.smtp_user, cfg.recipient_email, msg.as_string())

    logger.info("Email sent → %s | subject: %s", cfg.recipient_email, subject)


# ---------------------------------------------------------------------------
# Supabase
# ---------------------------------------------------------------------------

def _supabase_headers(cfg: Config) -> dict[str, str]:
    return {
        "apikey":        cfg.supabase_key,
        "Authorization": f"Bearer {cfg.supabase_key}",
        "Content-Type":  "application/json",
        "Prefer":        "return=minimal",
    }


def save_to_supabase(cfg: Config, payload: dict[str, Any]) -> None:
    table    = SUPABASE_TABLE[payload["type"]]
    url      = f"{cfg.supabase_url}/rest/v1/{table}"
    response = httpx.post(url, json=payload, headers=_supabase_headers(cfg), timeout=10)

    if response.status_code not in (200, 201):
        raise RuntimeError(
            f"Supabase insert failed [{response.status_code}]: {response.text}"
        )

    logger.info("Saved to Supabase table '%s'", table)


# ---------------------------------------------------------------------------
# Public interface
# ---------------------------------------------------------------------------

class FormHandler:
    def __init__(self, config_overrides: dict[str, str] | None = None):
        self.cfg = Config(config_overrides)
        self.cfg.validate()

    def handle(self, payload: dict[str, Any]) -> dict[str, str]:
        validate_payload(payload)

        builder = (
            build_contact_email if payload["type"] == "Form Message"
            else build_project_email
        )
        subject, plain, html = builder(payload)
        result: dict[str, str] = {}

        try:
            send_email(self.cfg, subject, plain, html, reply_to=payload.get("email"))
            result["email"] = "ok"
        except Exception as exc:
            logger.error("Email delivery failed: %s", exc, exc_info=True)
            result["email"] = str(exc)

        try:
            save_to_supabase(self.cfg, payload)
            result["supabase"] = "ok"
        except Exception as exc:
            logger.error("Supabase insert failed: %s", exc, exc_info=True)
            result["supabase"] = str(exc)

        return result


def handle_submission(
    payload: dict[str, Any],
    config_overrides: dict[str, str] | None = None,
) -> dict[str, str]:
    return FormHandler(config_overrides).handle(payload)


# ---------------------------------------------------------------------------
# SQL — run once in Supabase SQL editor
# ---------------------------------------------------------------------------
# CREATE TABLE IF NOT EXISTS public.contact_messages (
#   id            bigserial PRIMARY KEY,
#   "firstName"   text NOT NULL,
#   "lastName"    text NOT NULL,
#   email         text NOT NULL,
#   subject       text,
#   message       text,
#   "submittedAt" timestamptz,
#   type          text,
#   created_at    timestamptz DEFAULT now()
# );
#
# CREATE TABLE IF NOT EXISTS public.project_submissions (
#   id            bigserial PRIMARY KEY,
#   "firstName"   text NOT NULL,
#   "lastName"    text NOT NULL,
#   email         text NOT NULL,
#   phone         text,
#   company       text,
#   role          text,
#   "howFound"    text,
#   services      text[],
#   budget        text,
#   brief         text,
#   "submittedAt" timestamptz,
#   type          text,
#   created_at    timestamptz DEFAULT now()
# );