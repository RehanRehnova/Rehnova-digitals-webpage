

import logging
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv
from form_handler import handle_submission

load_dotenv() 
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Routes 

@app.route("/")
def index():
    """Serve the main HTML page."""
    return render_template("index.html")


@app.route("/submit", methods=["POST"])
def submit():
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
        logger.warning("Validation error: %s", exc)
        return jsonify({"error": str(exc)}), 400
    except EnvironmentError as exc:
        logger.error("Config error: %s", exc)
        return jsonify({"error": "Server misconfiguration — contact the admin"}), 500

    if result.get("email") != "ok" and result.get("supabase") != "ok":
        logger.error("Both email and Supabase failed: %s", result)
        return jsonify({"error": "Submission failed", "detail": result}), 500

    if result.get("email") != "ok":
        logger.warning("Email failed but Supabase saved: %s", result["email"])
    if result.get("supabase") != "ok":
        logger.warning("Supabase failed but email sent: %s", result["supabase"])

    return jsonify({"success": True, "result": result}), 200

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
