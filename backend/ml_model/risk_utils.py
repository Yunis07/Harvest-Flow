def binary_to_risk_score(allowed):
    """
    Convert rule decision to risk score.
    0 = no risk, 1 = high risk
    """
    return 0.2 if allowed else 0.8


def risk_level(score):
    if score <= 0.3:
        return "low"
    if score <= 0.6:
        return "medium"
    return "high"
