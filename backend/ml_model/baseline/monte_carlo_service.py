import random
import math
from .crop_profiles import CROP_PROFILES


# =========================================================
# GAUSSIAN SUITABILITY
# =========================================================

def gaussian_suitability(value, min_val, max_val):
    """
    Returns sharper suitability score between 0 and 1
    using tightened Gaussian decay.
    """

    center = (min_val + max_val) / 2

    # Tighter spread to increase crop differentiation
    spread = (max_val - min_val) / 3.0

    if spread <= 0:
        return 0.0

    distance = value - center

    score = math.exp(-(distance ** 2) / (2 * (spread ** 2)))

    return max(0.0, min(score, 1.0))


# =========================================================
# MONTE CARLO WEATHER VIABILITY
# =========================================================

def monte_carlo_weather_viability(
    crop_name: str,
    base_rainfall_mm: float,
    base_temperature_c: float,
    simulations: int = 2500,
    rainfall_std: float = None,
    temperature_std: float = None,
    distribution: str = "normal"
):
    """
    Refined 2D Monte Carlo weather viability simulation.

    Improvements:
    - Sharper Gaussian decay
    - Slight penalty for weak combined scores
    - Better crop separation
    """

    crop_key = crop_name.lower()

    if crop_key not in CROP_PROFILES:
        return {
            "crop": crop_name,
            "probability": 0.0,
            "risk_level": "High",
            "simulations": simulations
        }

    profile = CROP_PROFILES[crop_key]

    rain_min = profile["rainfall_min"]
    rain_max = profile["rainfall_max"]
    temp_min = profile["temp_min"]
    temp_max = profile["temp_max"]

    if base_rainfall_mm <= 0:
        return {
            "crop": crop_name,
            "probability": 0.0,
            "risk_level": "High",
            "simulations": simulations
        }

    # Default variability
    if rainfall_std is None:
        rainfall_std = max(base_rainfall_mm * 0.15, 5)

    if temperature_std is None:
        temperature_std = 1.8

    total_score = 0.0

    for _ in range(simulations):

        # Rainfall simulation
        simulated_rain = random.gauss(base_rainfall_mm, rainfall_std)
        simulated_rain = max(0, simulated_rain)

        # Temperature simulation
        simulated_temp = random.gauss(base_temperature_c, temperature_std)

        rain_score = gaussian_suitability(simulated_rain, rain_min, rain_max)
        temp_score = gaussian_suitability(simulated_temp, temp_min, temp_max)

        combined_score = (rain_score * 0.6) + (temp_score * 0.4)

        # Penalize weak overall suitability
        if combined_score < 0.4:
            combined_score *= 0.7

        total_score += combined_score

    probability = round(total_score / simulations, 3)

    if probability >= 0.70:
        risk_level = "Low"
    elif probability >= 0.45:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    return {
        "crop": crop_name,
        "probability": probability,
        "risk_level": risk_level,
        "simulations": simulations
    }
