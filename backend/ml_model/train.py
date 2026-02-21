import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler

from feature_engineering import add_features


# =====================================
# Resolve Paths Properly
# =====================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Move one level up to backend
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, ".."))

DATA_PATH = os.path.join(
    BACKEND_DIR,
    "data",
    "raw",
    "crop_recommendation_noisy.csv"
)

MODEL_PATH = os.path.join(BASE_DIR, "crop_model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "model_features.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")


# =====================================
# Training Start
# =====================================

print("\n=====================================")
print("TRAINING STARTED")
print("=====================================")

if not os.path.exists(DATA_PATH):
    raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")

print(f"\nLoading dataset from: {DATA_PATH}")

data = pd.read_csv(DATA_PATH)


# =====================================
# Validate Columns
# =====================================

required_columns = [
    "N", "P", "K",
    "temperature",
    "humidity",
    "ph",
    "rainfall",
    "label"
]

for col in required_columns:
    if col not in data.columns:
        raise ValueError(f"Missing required column: {col}")

# Clean dataset
data = data.dropna()

for col in required_columns[:-1]:
    data[col] = pd.to_numeric(data[col], errors="coerce")

data = data.dropna()

print("Dataset Shape After Cleaning:", data.shape)


# =====================================
# Validate Classes
# =====================================

unique_crops = sorted(data["label"].unique())

print("\nUnique Crops Found:")
print(unique_crops)

print("\nClass Distribution:")
print(data["label"].value_counts())

if len(unique_crops) < 2:
    raise ValueError("Dataset must contain at least 2 crop classes.")

print("\nTotal Crop Classes:", len(unique_crops))


# =====================================
# Feature Engineering
# =====================================

print("\nApplying feature engineering...")
data = add_features(data)


# =====================================
# Split Features and Labels
# =====================================

X = data.drop("label", axis=1)
y = data["label"]

print("\nFinal Features Used:")
print(list(X.columns))


# =====================================
# Train-Test Split
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# =====================================
# Feature Scaling
# =====================================

scaler = StandardScaler()

X_train_scaled = pd.DataFrame(
    scaler.fit_transform(X_train),
    columns=X_train.columns
)

X_test_scaled = pd.DataFrame(
    scaler.transform(X_test),
    columns=X_test.columns
)


# =====================================
# Train RandomForest
# =====================================

print("\nTraining RandomForest...")

model = RandomForestClassifier(
    n_estimators=500,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train_scaled, y_train)


# =====================================
# Evaluation
# =====================================

y_pred = model.predict(X_test_scaled)

accuracy = accuracy_score(y_test, y_pred)

print("\n=====================================")
print("MODEL PERFORMANCE")
print("=====================================")

print("Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# =====================================
# Feature Importance
# =====================================

print("\nFeature Importance:")

importance_pairs = list(zip(X.columns, model.feature_importances_))
importance_pairs.sort(key=lambda x: x[1], reverse=True)

for feature, importance in importance_pairs:
    print(f"{feature}: {round(importance, 4)}")


# =====================================
# Save Model
# =====================================

joblib.dump(model, MODEL_PATH)
joblib.dump(list(X.columns), FEATURES_PATH)
joblib.dump(scaler, SCALER_PATH)

print("\n=====================================")
print("MODEL SAVED SUCCESSFULLY")
print("=====================================")

print("Model path:", MODEL_PATH)
print("Features path:", FEATURES_PATH)
print("Scaler path:", SCALER_PATH)

# Sanity check
loaded_model = joblib.load(MODEL_PATH)

print("\nFinal Model Classes:")
print(loaded_model.classes_)

print("\nTraining Complete Successfully.")
