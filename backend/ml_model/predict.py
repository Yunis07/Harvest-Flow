import os
import joblib
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

# --------------------------------------------------
# App Configuration
# --------------------------------------------------

app = Flask(__name__)
CORS(app)

# --------------------------------------------------
# Load Trained Model
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "crop_model.pkl")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

model = joblib.load(MODEL_PATH)

# --------------------------------------------------
# Health Check Route
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Crop Prediction API Running"
    })


# --------------------------------------------------
# Get All Available Crops (Dynamic Dropdown Support)
# --------------------------------------------------

@app.route("/crops", methods=["GET"])
def get_crops():
    try:
        if hasattr(model, "classes_"):
            crops = list(model.classes_)
            return jsonify({"crops": crops})
        else:
            return jsonify({"error": "Model does not expose classes_"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Prediction Route
# --------------------------------------------------

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No JSON body provided"}), 400

        required_fields = [
            "N", "P", "K",
            "temperature",
            "humidity",
            "ph",
            "rainfall"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Convert inputs
        N = float(data["N"])
        P = float(data["P"])
        K = float(data["K"])
        temperature = float(data["temperature"])
        humidity = float(data["humidity"])
        ph = float(data["ph"])
        rainfall = float(data["rainfall"])

        # Input validation
        if not (0 <= N <= 200):
            return jsonify({"error": "N must be between 0 and 200"}), 400

        if not (0 <= P <= 200):
            return jsonify({"error": "P must be between 0 and 200"}), 400

        if not (0 <= K <= 200):
            return jsonify({"error": "K must be between 0 and 200"}), 400

        if not (0 <= temperature <= 60):
            return jsonify({"error": "Temperature must be between 0 and 60"}), 400

        if not (0 <= humidity <= 100):
            return jsonify({"error": "Humidity must be between 0 and 100"}), 400

        if not (0 <= ph <= 14):
            return jsonify({"error": "pH must be between 0 and 14"}), 400

        if not (0 <= rainfall <= 500):
            return jsonify({"error": "Rainfall must be between 0 and 500"}), 400

        # Prepare features
        features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])

        # Predict
        prediction = model.predict(features)[0]

        # Confidence
        confidence = None
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features)
            confidence = float(np.max(probabilities))

        return jsonify({
            "prediction": prediction,
            "confidence": round(confidence * 100, 2) if confidence is not None else None
        })

    except ValueError:
        return jsonify({"error": "Invalid numeric input"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --------------------------------------------------
# Run Server
# --------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
