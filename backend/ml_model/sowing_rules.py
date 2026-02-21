import os
import pandas as pd

# -------------------------------
# File paths
# -------------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQ_PATH = os.path.join(BASE_DIR, "data", "raw", "crop_requirements.csv")
SOIL_PATH = os.path.join(BASE_DIR, "data", "raw", "soil_types.csv")

# -------------------------------
# Load data once
# -------------------------------

requirements = pd.read_csv(REQ_PATH)
soils = pd.read_csv(SOIL_PATH)

# -------------------------------
# Core sowing rule engine
# -------------------------------

def check_sowing_risk(
    crop_name,
    soil_type,
    rainfall_level   # expected: "low", "medium", "high"
):
    """
    Rule-based sowing suitability check.

    Returns:
    {
        "allowed": bool,
        "reason": str
    }
    """

    # 1. Check crop exists
    crop_row = requirements[requirements["crop_name"] == crop_name]

    if crop_row.empty:
        return {
            "allowed": False,
            "reason": "Crop not supported"
        }

    crop = crop_row.iloc[0]

    # 2. Check soil exists
    soil_row = soils[soils["soil_type"] == soil_type]

    if soil_row.empty:
        return {
            "allowed": False,
            "reason": "Soil type unsupported"
        }

    # 3. Rainfall sensitivity rule
    # Expected values in CSV: low / medium / high
    sensitivity = str(crop["rain_sensitivity"]).lower()
    rainfall_level = rainfall_level.lower()

    if sensitivity == "high" and rainfall_level == "low":
        return {
            "allowed": False,
            "reason": "Crop requires high rainfall"
        }

    if sensitivity == "low" and rainfall_level == "high":
        return {
            "allowed": False,
            "reason": "Crop sensitive to excess rainfall"
        }

    # 4. Passed all rules
    return {
        "allowed": True,
        "reason": "Crop suitable for sowing under given conditions"
    }
