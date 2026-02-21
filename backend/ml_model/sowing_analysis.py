from sowing_service import analyze_sowing
from risk_utils import binary_to_risk_score, risk_level


def run_sowing_analysis(city, crop, soil_type, rainfall_level):
    result = analyze_sowing(city, crop, soil_type, rainfall_level)

    score = binary_to_risk_score(result["is_suitable"])

    result["risk_score"] = score
    result["risk_level"] = risk_level(score)

    return result
