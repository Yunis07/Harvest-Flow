from baseline.recommendation_service import recommend_crop
from dotenv import load_dotenv
load_dotenv()

print("Testing Coimbatore")
result1 = recommend_crop("Coimbatore")
print(result1)

print("\nTesting Chennai")
result2 = recommend_crop("Chennai")
print(result2)

print("\nTesting Delhi")
result3 = recommend_crop("Delhi")
print(result3)
