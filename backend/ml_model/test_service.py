from prediction_service import CropPredictor

predictor = CropPredictor()

sample = {
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.5,
    "humidity": 82,
    "ph": 6.5,
    "rainfall": 202
}

result = predictor.predict(sample)
print("Recommended Crop:", result)
