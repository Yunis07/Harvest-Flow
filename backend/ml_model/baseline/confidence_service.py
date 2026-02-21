def calculate_confidence(
    *,
    weather_severity: str,
    rainfall_level: str,
    soil_type: str,
    crop: str,
    production_rank: int
) -> int:
    """
    Calculate confidence score for a crop recommendation.

    Returns:
        int: confidence score between 0 and 100
    """

    score = 0

    # --------------------------------
    # 1. Weather severity (max 40)
    # --------------------------------
    if weather_severity == "good":
        score += 40
    elif weather_severity == "moderate":
        score += 25
    else:
        score += 10

    # --------------------------------
    # 2. Rainfall suitability (max 20)
    # --------------------------------
    if rainfall_level == "medium":
        score += 20
    elif rainfall_level in ["low", "high"]:
        score += 10
    else:
        score += 5

    # --------------------------------
    # 3. Soil compatibility (max 20)
    # --------------------------------
    soil_type = soil_type.lower()

    if soil_type in ["neutral", "loamy"]:
        score += 20
    elif soil_type in ["clayey", "sandy"]:
        score += 12
    else:
        score += 8

    # --------------------------------
    # 4. Production strength (max 20)
    # --------------------------------
    if production_rank <= 5:
        score += 20
    elif production_rank <= 10:
        score += 14
    elif production_rank <= 20:
        score += 8
    else:
        score += 4

    return min(score, 100)
