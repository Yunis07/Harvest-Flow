import pandas as pd
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "crop_recommendation.csv")

df = pd.read_csv(DATA_PATH)

target_crops = {
    "mustard": {
        "N": (60, 90),
        "P": (40, 60),
        "K": (30, 50),
        "temperature": (10, 25),
        "humidity": (50, 70),
        "ph": (6.0, 7.5),
        "rainfall": (40, 100)
    },
    "tomato": {
        "N": (80, 120),
        "P": (50, 80),
        "K": (50, 100),
        "temperature": (18, 30),
        "humidity": (60, 80),
        "ph": (6.0, 6.8),
        "rainfall": (50, 150)
    },
    "potato": {
        "N": (100, 150),
        "P": (50, 100),
        "K": (100, 150),
        "temperature": (15, 25),
        "humidity": (60, 80),
        "ph": (5.0, 6.5),
        "rainfall": (50, 120)
    },
    "onion": {
        "N": (60, 100),
        "P": (40, 80),
        "K": (40, 80),
        "temperature": (15, 30),
        "humidity": (60, 75),
        "ph": (6.0, 7.0),
        "rainfall": (40, 100)
    }
}

new_rows = []

for crop, ranges in target_crops.items():
    current_count = df[df["label"] == crop].shape[0]
    needed = 100 - current_count

    if needed <= 0:
        continue

    for _ in range(needed):
        row = {
            "N": np.random.randint(*ranges["N"]),
            "P": np.random.randint(*ranges["P"]),
            "K": np.random.randint(*ranges["K"]),
            "temperature": round(np.random.uniform(*ranges["temperature"]), 2),
            "humidity": round(np.random.uniform(*ranges["humidity"]), 2),
            "ph": round(np.random.uniform(*ranges["ph"]), 2),
            "rainfall": round(np.random.uniform(*ranges["rainfall"]), 2),
            "label": crop
        }
        new_rows.append(row)

if new_rows:
    df = pd.concat([df, pd.DataFrame(new_rows)], ignore_index=True)
    df.to_csv(DATA_PATH, index=False)
    print("Rows added successfully.")
else:
    print("All crops already have 100 rows.")

print("\nFinal class distribution:")
print(df["label"].value_counts())
