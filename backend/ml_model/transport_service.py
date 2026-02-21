from transport_rules import check_transport_risk
from weather_service import get_weather


def analyze_transport(crop, from_city, to_city, distance_km):
    """
    Perform transport analysis using real-time weather data.

    Inputs:
    - crop: str
    - from_city: str
    - to_city: str
    - distance_km: float

    Returns:
    - dict with transport decision and reason
    """

    # Use destination weather for spoilage risk
    weather = get_weather(to_city)
    weather_severity = weather["weather_severity"]

    result = check_transport_risk(
        crop_name=crop,
        distance_km=distance_km,
        weather_severity=weather_severity
    )

    # Attach context
    result["from_city"] = from_city
    result["to_city"] = to_city
    result["weather_severity"] = weather_severity

    return result
