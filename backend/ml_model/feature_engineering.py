import numpy as np
import pandas as pd


def add_features(data: pd.DataFrame) -> pd.DataFrame:
    data = data.copy()

    data["temperature_squared"] = data["temperature"] ** 2
    data["rainfall_log"] = np.log(data["rainfall"] + 1)
    data["nutrient_total"] = data["N"] + data["P"] + data["K"]
    data["np_ratio"] = data["N"] / (data["P"] + 1)
    data["NPK_ratio"] = (data["N"] + data["P"] + 1) / (data["K"] + 1)
    data["nutrient_balance"] = (
        abs(data["N"] - data["P"]) +
        abs(data["P"] - data["K"]) +
        abs(data["N"] - data["K"])
    )
    data["climate_index"] = (
        data["temperature"] * data["humidity"]
    ) / (data["rainfall"] + 1)

    return data
