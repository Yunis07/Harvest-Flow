import os
import pandas as pd


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "data", "raw")

soil_types_path = os.path.join(DATA_PATH, "soil_types.csv")
soil_nutrients_path = os.path.join(DATA_PATH, "soil_nutrients.csv")

print("Looking for soil_types.csv at:", soil_types_path)
print("Looking for soil_nutrients.csv at:", soil_nutrients_path)

if not os.path.exists(soil_types_path):
    raise FileNotFoundError(f"soil_types.csv not found at {soil_types_path}")

if not os.path.exists(soil_nutrients_path):
    raise FileNotFoundError(f"soil_nutrients.csv not found at {soil_nutrients_path}")

soil_types_df = pd.read_csv(soil_types_path)
soil_nutrients_df = pd.read_csv(soil_nutrients_path)


def get_soil_data(region: str):

    region = region.strip()

    region_row = soil_types_df[
        soil_types_df["region"].str.lower() == region.lower()
    ]

    if region_row.empty:
        raise ValueError(f"Region '{region}' not found in soil_types.csv")

    soil_type = region_row.iloc[0]["soil_type"]
    ph = float(region_row.iloc[0]["ph"])

    nutrient_row = soil_nutrients_df[
        soil_nutrients_df["soil_type"].str.lower() == soil_type.lower()
    ]

    if nutrient_row.empty:
        raise ValueError(f"Soil type '{soil_type}' not found in soil_nutrients.csv")

    N = float(nutrient_row.iloc[0]["N"])
    P = float(nutrient_row.iloc[0]["P"])
    K = float(nutrient_row.iloc[0]["K"])

    return {
        "soil_type": soil_type,
        "N": N,
        "P": P,
        "K": K,
        "ph": ph
    }
