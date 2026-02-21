import os
import pickle
import pandas as pd
from baseline.monte_carlo_service import monte_carlo_weather_viability


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "ml_model", "crop_model.pkl")
REQ_PATH = os.path.join(BASE_DIR, "data", "raw", "crop_requirements.csv")

# Load model once
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# Load crop requirements
requirements = pd.read_csv(REQ_PATH)


def classify_rainfall(rainfall_mm):
    if rainfall_mm < 300:
        return "low"
    elif rainfall_mm < 700:
        return "medium"
    else:
        return "high"


def recommend_crop(
    N,
    P,
    K,
    temperature,
    humidity,
    ph,
    rainfall_mm,
    soil_type
):
    # ---- DEBUG PRINT ----
    print("Rainfall sent to model:", rainfall_mm)

    # ---- ML Prediction ----
    input_features = [[N, P, K, temperature, humidity, ph, rainfall_mm]]
    predicted_crop = model.predict(input_features)[0]

    # ---- Monte Carlo Risk ----
    crop_row = requirements[requirements["crop_name"] == predicted_crop]

    if crop_row.empty:
        return {
            "error": "Crop not found in requirements dataset"
        }

    optimal_min = crop_row.iloc[0]["rain_min"]
    optimal_max = crop_row.iloc[0]["rain_max"]

    mc_result = monte_carlo_weather_viability(
        base_rainfall_mm=rainfall_mm,
        optimal_min=optimal_min,
        optimal_max=optimal_max
    )

    # ---- Rule Based Filter ----
    rainfall_level = classify_rainfall(rainfall_mm)
    sensitivity = str(crop_row.iloc[0]["rain_sensitivity"]).lower()

    allowed = False

    if rainfall_level == "high" and sensitivity in ["medium", "high"]:
        allowed = True
    elif rainfall_level == "medium":
        allowed = True
    elif rainfall_level == "low" and sensitivity in ["low", "medium"]:
        allowed = True

    if not allowed:
        return {
            "predicted_crop": predicted_crop,
            "approved": False,
            "reason": "Rainfall sensitivity mismatch",
            "monte_carlo": mc_result
        }

    # ---- Final Structured Response ----
    return {
        "predicted_crop": predicted_crop,
        "approved": True,
        "soil_type": soil_type,
        "rainfall_mm": rainfall_mm,
        "monte_carlo": mc_result
    }
