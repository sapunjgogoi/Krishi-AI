"""
Krishi AI – Smart Farming Assistant
Flask backend that securely calls Google Gemini API.
All API calls happen server-side; no secrets are exposed to the frontend.
"""

import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# ─── Configure Gemini API (server-side only) ─────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise EnvironmentError(
        "GEMINI_API_KEY is not set. Please add it to your .env file."
    )

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Render the main input form."""
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():
    """
    Accept crop symptom input, call Gemini API, return structured diagnosis.
    Expects JSON body: { "symptoms": "..." }
    Returns JSON: { "success": true, "data": { disease, cause, treatment, prevention } }
    """
    data = request.get_json()

    # ── Input validation ──────────────────────────────────────────────────────
    if not data or not data.get("symptoms"):
        return jsonify({"success": False, "error": "Please describe the crop symptoms."}), 400

    symptoms = data["symptoms"].strip()

    if len(symptoms) < 10:
        return jsonify({"success": False, "error": "Please provide more detail about the symptoms."}), 400

    if len(symptoms) > 2000:
        return jsonify({"success": False, "error": "Input too long. Please limit to 2000 characters."}), 400

    # ── Build structured prompt ───────────────────────────────────────────────
    prompt = f"""You are an expert agricultural scientist and plant pathologist.
A farmer describes crop symptoms: {symptoms}

Analyze the symptoms and respond STRICTLY in this exact format with no extra text before or after:

Disease: [name of the disease or condition]
Cause: [cause of the disease - fungal, bacterial, viral, pest, nutrient deficiency, etc.]
Treatment: [specific treatment steps the farmer should take immediately]
Prevention: [preventive measures to avoid recurrence in the future]

Keep each section concise, practical, and easy for a non-expert farmer to understand."""

    # ── Call Gemini API (server-side) ─────────────────────────────────────────
    try:
        response = model.generate_content(prompt)
        raw_text = response.text.strip()

        # Parse structured response into a dict
        result = parse_gemini_response(raw_text)

        return jsonify({"success": True, "data": result})

    except Exception as e:
        app.logger.error(f"Gemini API error: {e}")
        return jsonify({
            "success": False,
            "error": "AI service is currently unavailable. Please try again in a moment."
        }), 503


def parse_gemini_response(text: str) -> dict:
    """
    Parse Gemini's structured text response into a Python dict.
    Falls back gracefully if the format is unexpected.
    """
    fields = {
        "disease": "",
        "cause": "",
        "treatment": "",
        "prevention": ""
    }

    key_map = {
        "disease": "disease",
        "cause": "cause",
        "treatment": "treatment",
        "prevention": "prevention"
    }

    current_key = None
    current_lines = []

    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue

        matched = False
        for prefix, field in key_map.items():
            if line.lower().startswith(f"{prefix}:"):
                # Save previous field
                if current_key:
                    fields[current_key] = " ".join(current_lines).strip()
                current_key = field
                # Get inline content after the colon
                current_lines = [line[len(prefix) + 1:].strip()]
                matched = True
                break

        if not matched and current_key:
            current_lines.append(line)

    # Save the last field
    if current_key:
        fields[current_key] = " ".join(current_lines).strip()

    # If parsing totally failed, return raw text under disease
    if not any(fields.values()):
        fields["disease"] = text

    return fields


# ─── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)
