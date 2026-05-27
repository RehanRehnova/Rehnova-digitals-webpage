"""
app.py
======
Flask entry point. Serves the HTML frontend and exposes a single
/submit endpoint that handles both form types.

Folder structure expected:
  project/
  ├── app.py
  ├── form_handler.py
  ├── .env
  ├── templates/
  │   └── index.html
  └── static/
      ├── css/
      │   └── styles.css
      └── js/
          └── main.js

Install deps:
  pip install flask python-dotenv httpx

Run:
  python app.py
  → http://localhost:5000
"""

import logging
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from form_handler import handle_submission

load_dotenv()  # loads .env before anything else

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/")
def index():
    """Serve the main HTML page."""
    return render_template("index.html")


@app.route("/submit", methods=["POST"])
def submit():
    """
    Accepts JSON from both JS forms:
      - type: "Form Message"  → contact form
      - type: "Project Form"  → booking / project brief

    Returns:
      200  { "success": true,  "result": { "email": "ok", "supabase": "ok" } }
      400  { "error": "..." }   — bad / missing payload
      500  { "error": "..." }   — both email AND supabase failed
    """
    payload = request.get_json(silent=True)

    if not payload:
        logger.warning("Received empty or non-JSON request body")
        return jsonify({"error": "No JSON payload received"}), 400

    form_type = payload.get("type")
    if form_type not in ("Form Message", "Project Form"):
        return jsonify({"error": f"Unknown form type: '{form_type}'"}), 400

    logger.info("Received submission → type: %s | email: %s",
                form_type, payload.get("email", "—"))

    try:
        result = handle_submission(payload)
    except ValueError as exc:
        # validation error (missing required fields)
        logger.warning("Validation error: %s", exc)
        return jsonify({"error": str(exc)}), 400
    except EnvironmentError as exc:
        # missing env vars — misconfiguration on the server side
        logger.error("Config error: %s", exc)
        return jsonify({"error": "Server misconfiguration — contact the admin"}), 500

    # if BOTH channels failed, return 500 so JS .catch() fires
    if result.get("email") != "ok" and result.get("supabase") != "ok":
        logger.error("Both email and Supabase failed: %s", result)
        return jsonify({"error": "Submission failed", "detail": result}), 500

    # partial failure is still a 200 — submission was recorded somewhere
    if result.get("email") != "ok":
        logger.warning("Email failed but Supabase saved: %s", result["email"])
    if result.get("supabase") != "ok":
        logger.warning("Supabase failed but email sent: %s", result["supabase"])

    return jsonify({"success": True, "result": result}), 200


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)