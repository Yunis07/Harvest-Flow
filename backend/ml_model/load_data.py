import os
import pandas as pd

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

REQ_PATH = os.path.join(BASE_DIR, "data", "raw", "crop_requirements.csv")
SOIL_PATH = os.path.join(BASE_DIR, "data", "raw", "soil_types.csv")

requirements = pd.read_csv(REQ_PATH)
soils = pd.read_csv(SOIL_PATH)

print("\nCROP REQUIREMENTS")
print(requirements.head())
print(requirements.columns)

print("\nSOIL TYPES")
print(soils.head())
print(soils.columns)

print("\nLoad successful")

