import os
import pandas as pd

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

INPUT_PATH = os.path.join(
    BASE_DIR, "ml_model", "data", "CropDataset-Enhanced.csv"
)

OUTPUT_PATH = os.path.join(
    BASE_DIR, "data", "processed", "crop_requirements_clean.csv"
)


def ph_range(row):
    if row.get("pH - Acidic", 0) == 1:
        return 4.5, 6.0
    if row.get("pH - Neutral", 0) == 1:
        return 6.0, 7.5
    if row.get("pH - Alkaline", 0) == 1:
        return 7.5, 9.0
    return 6.0, 7.0


def nutrient_level(high, medium, low):
    if high == 1:
        return "high"
    if medium == 1:
        return "medium"
    if low == 1:
        return "low"
    return "medium"


def climate_defaults(crop):
    crop = crop.lower()

    if crop in ["rice", "paddy"]:
        return 20, 35, 100, 300
    if crop in ["maize", "corn"]:
        return 18, 32, 50, 150
    if crop in ["wheat"]:
        return 10, 25, 40, 120
    if crop in ["sorghum", "jowar", "bajra", "millet"]:
        return 20, 35, 30, 100
    if crop in ["groundnut", "soybean"]:
        return 20, 30, 60, 150

    return 18, 32, 50, 150


def generate_crop_requirements():
    print("Reading enhanced dataset from:")
    print(INPUT_PATH)

    df = pd.read_csv(INPUT_PATH)
    df.columns = df.columns.str.strip()

    records = []

    for _, row in df.iterrows():
        crop = str(row["Crop"]).strip().lower()

        ph_min, ph_max = ph_range(row)

        nitrogen = nutrient_level(
            row.get("Nitrogen - High", 0),
            row.get("Nitrogen - Medium", 0),
            row.get("Nitrogen - Low", 0),
        )

        phosphorus = nutrient_level(
            row.get("Phosphorous - High", 0),
            row.get("Phosphorous - Medium", 0),
            row.get("Phosphorous - Low", 0),
        )

        potassium = nutrient_level(
            row.get("Potassium - High", 0),
            row.get("Potassium - Medium", 0),
            row.get("Potassium - Low", 0),
        )

        temp_min, temp_max, rain_min, rain_max = climate_defaults(crop)

        records.append({
            "crop": crop,
            "ph_min": ph_min,
            "ph_max": ph_max,
            "nitrogen_level": nitrogen,
            "phosphorus_level": phosphorus,
            "potassium_level": potassium,
            "temp_min": temp_min,
            "temp_max": temp_max,
            "rainfall_min": rain_min,
            "rainfall_max": rain_max,
        })

    out_df = pd.DataFrame(records)
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    out_df.to_csv(OUTPUT_PATH, index=False)

    print("Generated crop requirements at:")
    print(OUTPUT_PATH)
    print(out_df.head())


if __name__ == "__main__":
    generate_crop_requirements()
