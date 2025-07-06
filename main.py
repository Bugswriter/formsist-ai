# app.py
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import os
import json
from rag_portfolio import PortfolioChatAgent # Import the new module

app = Flask(__name__)
CORS(app)

# --- Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY environment variable not set. Please set it or replace the placeholder in app.py.")
    print("You can get an API key from https://ai.google.dev/")

PORTFOLIO_FILE_PATH = os.getenv("PORTFOLIO_FILE_PATH", "portfolio.txt")
SYSTEM_PROMPT_FILE_PATH = os.getenv("SYSTEM_PROMPT_FILE_PATH", "system_prompt.txt") # Renamed from PROMPT_FILE_PATH

# --- Initialize PortfolioChatAgent globally when the app starts ---
portfolio_agent = None
try:
    portfolio_agent = PortfolioChatAgent(
        portfolio_file_path=PORTFOLIO_FILE_PATH,
        api_key=GEMINI_API_KEY,
        prompt_file_path=SYSTEM_PROMPT_FILE_PATH # Pass the updated prompt file path
    )
    print("PortfolioChatAgent initialized successfully.")
except Exception as e:
    print(f"ERROR: Failed to initialize PortfolioChatAgent: {e}")
    print("Please ensure GEMINI_API_KEY is set, portfolio.txt exists, and system_prompt.txt exists and is readable.")
    exit(1)

@app.route('/fillit', methods=['POST'])
def fill_form():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    form_html = data.get('formHtml')

    if not form_html:
        return jsonify({"error": "No 'formHtml' provided in the request"}), 400

    print("Received form HTML for processing.")

    if portfolio_agent is None:
        return jsonify({"error": "Portfolio agent not initialized. Check backend logs."}), 500

    try:
        generated_js = portfolio_agent.generate_form_filling_script(form_html)

        if generated_js.startswith("```javascript") and generated_js.endswith("```"):
            generated_js = generated_js[len("```javascript"):-len("```")].strip()
        elif generated_js.startswith("```") and generated_js.endswith("```"):
            generated_js = generated_js[len("```"):-len("```")].strip()

        print("Generated JavaScript successfully.")

        return Response(generated_js, mimetype='application/javascript')

    except Exception as e:
        print(f"Error calling Gemini API or generating script: {e}")
        return jsonify({"error": f"Failed to generate form-filling script: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

