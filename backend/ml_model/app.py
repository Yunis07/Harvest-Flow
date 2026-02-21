import os
from flask import Flask, jsonify, request
from dotenv import load_dotenv
from flask_cors import CORS

from baseline.recommendation_service import recommend_crop


# =====================================
# Load Environment Variables
# =====================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(BASE_DIR)
ENV_PATH = os.path.join(BACKEND_DIR, ".env")

load_dotenv(dotenv_path=ENV_PATH)

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

print("Backend starting...")
print("Weather API loaded:", WEATHER_API_KEY is not None)


# =====================================
# Create Flask App
# =====================================

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "status": "Backend running",
        "weather_api_loaded": WEATHER_API_KEY is not None,
        "engine": "Hybrid ML + Monte Carlo + Climate Intelligence v4"
    })


# =====================================
# MAIN RISK ANALYSIS ENDPOINT
# =====================================

@app.route("/risk-analysis", methods=["POST"])
def risk_analysis():

    try:
        print("\n===== NEW REQUEST =====")

        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        if "region" not in data:
            return jsonify({"error": "Missing field: region"}), 400

        region = data["region"].strip().lower()
        selected_crop = data.get("crop", "").strip().lower()

        print("Region:", region)
        print("Selected Crop:", selected_crop)

        # Run Hybrid Recommendation Engine
        result = recommend_crop(region)

        all_scores = result.get("all_scores", [])
        weather = result.get("weather", {})

        if not all_scores:
            return jsonify({"error": "No crop scores returned from engine"}), 500

        # Sort scores descending
        all_scores = sorted(
            all_scores,
            key=lambda x: x["confidence_percent"],
            reverse=True
        )

        # Top 3 recommendations
        top_3 = all_scores[:3]

        # Worst recommendation
        worst = all_scores[-1]

        # Selected crop confidence
        selected_confidence = 0.0
        for item in all_scores:
            if item["crop"].lower() == selected_crop:
                selected_confidence = item["confidence_percent"]
                break

        # Risk classification
        if selected_confidence >= 80:
            risk_level = "Low"
        elif selected_confidence >= 60:
            risk_level = "Medium"
        elif selected_confidence >= 40:
            risk_level = "High"
        else:
            risk_level = "Critical"

        response = {
            "weather": {
                "temperature": weather.get("weekly_avg_temperature"),
                "humidity": weather.get("weekly_avg_humidity"),
                "rainfall": weather.get("estimated_monthly_rainfall")
            },

            "selected_crop": {
                "crop": selected_crop,
                "confidence_percent": round(selected_confidence, 2),
                "risk_level": risk_level
            },

            "model_recommendation": {
                "recommended_crop": top_3[0]["crop"],
                "confidence_percent": round(top_3[0]["confidence_percent"], 2)
            },

            "top_3_recommendations": [
                {
                    "crop": item["crop"],
                    "confidence_percent": round(item["confidence_percent"], 2)
                }
                for item in top_3
            ],

            "worst_recommendation": {
                "crop": worst["crop"],
                "confidence_percent": round(worst["confidence_percent"], 2)
            },

            "agronomic_note": result.get("agronomic_note"),

            "engine": result.get("engine")
        }

        print("===== SUCCESS =====\n")
        return jsonify(response), 200

    except Exception as e:
        print("\n===== FULL ERROR =====")
        print(str(e))
        print("===== FAILED =====\n")

        return jsonify({"error": str(e)}), 500


# =====================================
# Run Server
# =====================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
