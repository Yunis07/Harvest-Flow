import os
import math
import joblib
import pandas as pd
from datetime import datetime
import numpy as np

from .weather_service import get_weather
from .soil_service import get_soil_data
from .monte_carlo_service import monte_carlo_weather_viability


REGION_CLIMATE_MAP = {
    "coimbatore": "tropical",
    "chennai": "tropical",
    "madurai": "tropical",
    "delhi": "temperate"
}

KHARIF_CROPS = ["rice", "maize"]
RABI_CROPS = ["barley", "chickpea"]

TEMPERATE_CROPS = ["apple", "pear", "plum"]
TROPICAL_CROPS = ["banana", "coconut"]
WATER_HEAVY_CROPS = ["rice", "banana", "sugarcane"]


BASE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..")
)

ML_DIR = os.path.join(BASE_DIR, "ml_model")

MODEL_PATH = os.path.join(ML_DIR, "crop_model.pkl")
FEATURES_PATH = os.path.join(ML_DIR, "model_features.pkl")
SCALER_PATH = os.path.join(ML_DIR, "scaler.pkl")

model = joblib.load(MODEL_PATH)
feature_order = joblib.load(FEATURES_PATH)
scaler = joblib.load(SCALER_PATH)


def build_features(soil, weather):

    N = float(soil["N"])
    P = float(soil["P"])
    K = float(soil["K"])
    ph = float(soil["ph"])

    temperature = float(weather["weekly_avg_temperature"])
    humidity = float(weather["weekly_avg_humidity"])
    rainfall = float(weather["estimated_monthly_rainfall"])

    features = {
        "N": N,
        "P": P,
        "K": K,
        "temperature": temperature,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall,
        "temperature_squared": temperature ** 2,
        "rainfall_log": math.log(rainfall + 1),
        "nutrient_total": N + P + K,
        "np_ratio": N / (P + 1),
        "NPK_ratio": (N + P + 1) / (K + 1),
        "nutrient_balance": abs(N - P) + abs(P - K) + abs(N - K),
        "climate_index": (temperature * humidity) / (rainfall + 1)
    }

    df = pd.DataFrame([features])
    df = df[feature_order]

    return df


def apply_agronomic_rules(scores, soil, weather, region):

    rainfall = weather["estimated_monthly_rainfall"]
    temperature = weather["weekly_avg_temperature"]
    ph = soil["ph"]

    climate = REGION_CLIMATE_MAP.get(region, "tropical")
    current_month = datetime.now().month

    adjusted = scores.copy()

    rainfall_factor = min(rainfall / 120.0, 1.0)
    rainfall_multiplier = 0.8 + (0.5 * rainfall_factor)

    for crop in adjusted:

        crop_lower = crop.lower()

        if climate == "tropical" and crop_lower in TEMPERATE_CROPS:
            adjusted[crop] *= 0.6

        if climate == "temperate" and crop_lower in TROPICAL_CROPS:
            adjusted[crop] *= 0.6

        if crop_lower in WATER_HEAVY_CROPS:
            adjusted[crop] *= rainfall_multiplier

        if climate == "tropical" and crop_lower == "rice":
            adjusted[crop] *= 1.2

        if 6 <= current_month <= 9 and crop_lower in KHARIF_CROPS:
            adjusted[crop] *= 1.1

        if (current_month >= 10 or current_month <= 3) and crop_lower in RABI_CROPS:
            adjusted[crop] *= 1.1

        if temperature > 38 and crop_lower in ["wheat", "barley"]:
            adjusted[crop] *= 0.7

        if ph < 6 and crop_lower == "chickpea":
            adjusted[crop] *= 0.85

    return adjusted


def interpret_confidence(score):
    if score < 30:
        return "Critical"
    elif score < 60:
        return "Moderate"
    elif score < 80:
        return "Good"
    else:
        return "Excellent"


def generate_explanation(crop, soil, weather, mc_score):

    reasons = []

    temperature = weather["weekly_avg_temperature"]
    rainfall = weather["estimated_monthly_rainfall"]
    humidity = weather["weekly_avg_humidity"]

    if 20 <= temperature <= 30:
        reasons.append("Temperature within optimal growth range")

    if rainfall > 40:
        reasons.append("Rainfall supports stable yield")

    if humidity > 50:
        reasons.append("Humidity favorable for crop development")

    nutrient_total = soil["N"] + soil["P"] + soil["K"]
    if nutrient_total > 150:
        reasons.append("Strong soil nutrient availability")

    if mc_score > 0.6:
        reasons.append("Low climate volatility risk")

    if not reasons:
        reasons.append("Moderate environmental compatibility")

    return reasons


def recommend_crop(region: str):

    region = region.lower().strip()

    soil = get_soil_data(region)
    weather = get_weather(region)

    features = build_features(soil, weather)
    features_scaled = scaler.transform(features)

    ml_probabilities = model.predict_proba(features_scaled)[0]
    crop_classes = model.classes_

    combined_scores = {}
    mc_scores = {}

    for crop, ml_prob in zip(crop_classes, ml_probabilities):

        mc = monte_carlo_weather_viability(
            crop_name=crop,
            base_rainfall_mm=weather["estimated_monthly_rainfall"],
            base_temperature_c=weather["weekly_avg_temperature"]
        )

        mc_score = mc["probability"]
        mc_scores[crop] = mc_score

        ml_component = math.log(ml_prob + 1e-6) + 6
        risk_modifier = 0.7 + 0.6 * mc_score

        final_score = ml_component * risk_modifier

        combined_scores[crop] = final_score

    adjusted_scores = apply_agronomic_rules(
        combined_scores, soil, weather, region
    )

    values = np.array(list(adjusted_scores.values()))

    min_val = np.min(values)
    max_val = np.max(values)

    if max_val - min_val == 0:
        normalized = np.ones_like(values) * 0.5
    else:
        normalized = (values - min_val) / (max_val - min_val)

    scaled_scores = {
        crop: round(5 + norm * 90, 2)
        for crop, norm in zip(adjusted_scores.keys(), normalized)
    }

    sorted_scores = sorted(
        scaled_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    top_3 = sorted_scores[:3]
    worst_crop = sorted_scores[-1][0]

    return {
        "region": region,
        "weather": weather,
        "all_scores": [
            {
                "crop": crop,
                "confidence_percent": confidence,
                "confidence_level": interpret_confidence(confidence),
                "why": generate_explanation(
                    crop,
                    soil,
                    weather,
                    mc_scores[crop]
                )
            }
            for crop, confidence in sorted_scores
        ],
        "top_3": [
            {
                "crop": crop,
                "confidence_percent": confidence,
                "confidence_level": interpret_confidence(confidence)
            }
            for crop, confidence in top_3
        ],
        "worst_crop": worst_crop,
        "agronomic_note": "Hybrid ML probability, climate risk simulation, and agronomic rules applied.",
        "engine": "Hybrid ML + Monte Carlo + Explainable Calibration vHackathon"
    }
