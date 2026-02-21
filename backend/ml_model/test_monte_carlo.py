from baseline.monte_carlo_service import monte_carlo_crop_viability
from baseline.sowing_service import analyze_sowing

prob = monte_carlo_crop_viability(
    crop_name="maize",
    soil_type="Neutral",
    base_rainfall_level="medium",

    analyze_sowing_fn=analyze_sowing,
    simulations=500
)

print("Maize success probability:", prob)
