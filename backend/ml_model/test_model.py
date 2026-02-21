import joblib
import pandas as pd

from feature_engineering import add_features


# =====================================
# Load Saved Artifacts
# =====================================

model = joblib.load("crop_model.pkl")
scaler = joblib.load("scaler.pkl")
features = joblib.load("model_features.pkl")


# =====================================
# Sample Farm Input
# =====================================

sample_input = {
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.5,
    "humidity": 82,
    "ph": 6.5,
    "rainfall": 202
}


# =====================================
# Convert to DataFrame
# =====================================

input_df = pd.DataFrame([sample_input])


# =====================================
# Apply Feature Engineering
# =====================================

input_df = add_features(input_df)


# Ensure correct feature order
input_df = input_df[features]


# =====================================
# Scale
# =====================================

input_scaled = scaler.transform(input_df)


# =====================================
# Predict
# =====================================

prediction = model.predict(input_scaled)

print("\nRecommended Crop:", prediction[0])
