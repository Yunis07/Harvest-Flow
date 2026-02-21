import os
import pandas as pd


# =====================================
# PATH SETUP
# =====================================
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, "..", ".."))
DATA_DIR = os.path.join(BACKEND_DIR, "data", "raw")

SOIL_TYPES_PATH = os.path.join(DATA_DIR, "soil_types.csv")
SOIL_NUTRIENTS_PATH = os.path.join(DATA_DIR, "soil_nutrients.csv")


# =====================================
# SAFE LOAD FUNCTION
# =====================================
def safe_load_csv(path, required_columns):
    if not os.path.exists(path):
        print(f"Warning: Missing file at {path}")
        return None

    df = pd.read_csv(path)
    df.columns = df.columns.str.strip().str.lower()

    if not required_columns.issubset(set(df.columns)):
        print(f"Warning: File {path} missing required columns {required_columns}")
        return None

    return df


# =====================================
# LOAD DATA SAFELY
# =====================================
soil_types_df = safe_load_csv(
    SOIL_TYPES_PATH,
    {"region", "soil_type", "ph"}
)

soil_nutrients_df = safe_load_csv(
    SOIL_NUTRIENTS_PATH,
    {"soil_type", "n", "p", "k"}
)


# =====================================
# HELPERS
# =====================================
def normalize(text):
    return str(text).strip().lower()


def extract_base_soil_type(soil_type_name):
    if soil_nutrients_df is None:
        return None

    soil_type_name = normalize(soil_type_name)

    for base_type in soil_nutrients_df["soil_type"].unique():
        if normalize(base_type) in soil_type_name:
            return base_type

    return None


# =====================================
# MAIN FUNCTION
# =====================================
def get_soil_data(region):

    if not region:
        raise ValueError("Region is required")

    # ---------------------------------
    # If files missing → fallback
    # ---------------------------------
    if soil_types_df is None or soil_nutrients_df is None:
        print("Soil files missing. Using intelligent fallback soil values.")
        return {
            "region": region,
            "soil_type": "Unknown",
            "base_soil_type": "Generic",
            "N": 50.0,
            "P": 30.0,
            "K": 40.0,
            "ph": 6.5
        }

    region_normalized = normalize(region)

    region_rows = soil_types_df[
        soil_types_df["region"].str.lower() == region_normalized
    ]

    # ---------------------------------
    # If region not found → fallback
    # ---------------------------------
    if region_rows.empty:
        print(f"Region '{region}' not found in soil data. Using fallback.")
        return {
            "region": region,
            "soil_type": "Generic Loam",
            "base_soil_type": "Loam",
            "N": 60.0,
            "P": 35.0,
            "K": 45.0,
            "ph": 6.8
        }

    region_row = region_rows.iloc[0]
    soil_type_full = region_row["soil_type"]
    ph = float(region_row["ph"])

    base_soil_type = extract_base_soil_type(soil_type_full)

    if base_soil_type is None:
        print("Base soil type not mapped. Using fallback nutrients.")
        return {
            "region": region,
            "soil_type": soil_type_full,
            "base_soil_type": "Generic",
            "N": 55.0,
            "P": 30.0,
            "K": 40.0,
            "ph": ph
        }

    nutrient_rows = soil_nutrients_df[
        soil_nutrients_df["soil_type"].str.lower()
        == normalize(base_soil_type)
    ]

    if nutrient_rows.empty:
        print("Nutrient row missing. Using fallback values.")
        return {
            "region": region,
            "soil_type": soil_type_full,
            "base_soil_type": base_soil_type,
            "N": 55.0,
            "P": 30.0,
            "K": 40.0,
            "ph": ph
        }

    nutrient_row = nutrient_rows.iloc[0]

    return {
        "region": region_row["region"],
        "soil_type": soil_type_full,
        "base_soil_type": base_soil_type,
        "N": float(nutrient_row["n"]),
        "P": float(nutrient_row["p"]),
        "K": float(nutrient_row["k"]),
        "ph": ph
    }
