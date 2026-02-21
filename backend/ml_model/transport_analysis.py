from transport_service import analyze_transport
from risk_utils import binary_to_risk_score, risk_level


def run_transport_analysis(crop, from_city, to_city, distance_km, weather_severity):
    result = analyze_transport(
        crop, from_city, to_city, distance_km, weather_severity
    )

    if "is_safe" not in result:
        result["risk_level"] = "unknown"
        return result

    score = binary_to_risk_score(result["is_safe"])

    result["risk_score"] = score
    result["risk_level"] = risk_level(score)

    return result
