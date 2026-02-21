import random

def get_weather(region: str) -> dict:
    # Simulated weather for now

    return {
        "temperature": round(random.uniform(25, 35), 2),
        "humidity": round(random.uniform(60, 90), 2),
        "rainfall": round(random.uniform(100, 300), 2)
    }
