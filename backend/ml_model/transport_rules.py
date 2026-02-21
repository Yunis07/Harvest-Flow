import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPOILAGE_PATH = os.path.join(BASE_DIR, "data", "raw", "crop_spoilage.csv")

spoilage = pd.read_csv(SPOILAGE_PATH)

if "crop_name" not in spoilage.columns:
    raise ValueError("crop_spoilage.csv must contain 'crop_name' column")


def check_transport_risk(crop_name, distance_km, weather_severity):
    crop_row = spoilage[spoilage["crop_name"] == crop_name]

    if crop_row.empty:
        return {
            "allowed": False,
            "reason": "Crop not found in spoilage database"
        }

    avg_speed_kmph = 40
    travel_hours = distance_km / avg_speed_kmph

    # Conservative baseline rules
    if travel_hours > 12:
        return {
            "allowed": False,
            "reason": "Transport duration too long, high spoilage risk"
        }

    if weather_severity == "bad":
        return {
            "allowed": False,
            "reason": "Bad weather increases transport risk"
        }

    if weather_severity == "moderate" and travel_hours > 8:
        return {
            "allowed": False,
            "reason": "Moderate weather and long duration increase risk"
        }

    return {
        "allowed": True,
        "reason": "Transport considered safe under current conditions"
    }
