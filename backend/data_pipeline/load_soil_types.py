import os
import pandas as pd

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw", "crop_recommendation.csv")
OUT_PATH = os.path.join(BASE_DIR, "data", "processed", "soil_types_clean.csv")

print("Reading from:", RAW_PATH)

if not os.path.exists(RAW_PATH):
    raise FileNotFoundError(f"Missing file: {RAW_PATH}")

df = pd.read_csv(RAW_PATH)

if "ph" not in df.columns:
    raise ValueError(f"'ph' column missing. Found: {list(df.columns)}")

def classify_soil(ph):
    if ph < 5.5:
        return "Acidic"
    elif ph <= 7.5:
        return "Neutral"
    else:
        return "Alkaline"

df["soil_type"] = df["ph"].apply(classify_soil)

soil_df = (
    df.groupby("soil_type")
    .agg(
        ph_min=("ph", "min"),
        ph_max=("ph", "max"),
        samples=("ph", "count")
    )
    .reset_index()
)

soil_df.to_csv(OUT_PATH, index=False)

print("Soil pipeline completed successfully")
print(soil_df)
