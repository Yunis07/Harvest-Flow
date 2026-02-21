import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

RAW_PATH = os.path.join(BASE_DIR, "data", "raw", "crop_production_raw.csv")
PROCESSED_PATH = os.path.join(BASE_DIR, "data", "processed", "crop_production_clean.csv")


def load_and_clean_crop_production():
    if not os.path.exists(RAW_PATH):
        raise FileNotFoundError("crop_production_raw.csv not found in data/raw")

    df = pd.read_csv(RAW_PATH)

    # Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]

    required_columns = {"crop", "production"}
    if not required_columns.issubset(df.columns):
        raise ValueError("CSV must contain Crop and Production columns")

    # Keep only required columns
    df = df[["crop", "production"]]

    # Clean values
    df["crop"] = df["crop"].astype(str).str.strip()
    df["production"] = pd.to_numeric(df["production"], errors="coerce")

    df = df.dropna()
    df = df[df["production"] > 0]

    # Aggregate production per crop (India-wide)
    clean_df = (
        df.groupby("crop", as_index=False)["production"]
        .sum()
        .rename(columns={"crop": "crop_name", "production": "total_production"})
        .sort_values(by="total_production", ascending=False)
    )

    os.makedirs(os.path.dirname(PROCESSED_PATH), exist_ok=True)
    clean_df.to_csv(PROCESSED_PATH, index=False)

    return clean_df


if __name__ == "__main__":
    df = load_and_clean_crop_production()
    print(df.head(10))
