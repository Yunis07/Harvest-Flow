from sowing_rules import check_sowing_risk

result = check_sowing_risk(
    crop_name="Rice",
    soil_type="Loamy",
    rainfall_level="high"
)

print(result)
