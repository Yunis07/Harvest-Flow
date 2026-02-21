import os
import requests
from dotenv import load_dotenv

load_dotenv()


def safe_float(value, default=0.0):
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


# Regional rainfall baselines in mm per month
REGION_RAINFALL_BASELINE = {
    "chennai": 120,
    "coimbatore": 90,
    "madurai": 85,
    "delhi": 60
}


def get_weather(region):

    print("SMART WEATHER SERVICE ACTIVE")

    if not region:
        raise ValueError("Region is required")

    api_key = os.getenv("WEATHER_API_KEY")

    if not api_key:
        raise ValueError("Weather API key missing")

    query_location = f"{region},IN"

    weather_url = (
        "http://api.weatherapi.com/v1/forecast.json"
        f"?key={api_key}"
        f"&q={query_location}"
        f"&days=7"
        f"&aqi=no"
        f"&alerts=no"
    )

    try:
        response = requests.get(weather_url, timeout=10)
        response.raise_for_status()
        weather_data = response.json()
    except requests.exceptions.RequestException as e:
        raise Exception(f"Weather API request failed: {str(e)}")

    if "error" in weather_data:
        raise Exception(f"Weather API error: {weather_data['error']}")

    current_block = weather_data.get("current", {})
    forecast_days = weather_data.get("forecast", {}).get("forecastday", [])

    current_temp = safe_float(current_block.get("temp_c"))
    current_humidity = safe_float(current_block.get("humidity"))
    current_precip = safe_float(current_block.get("precip_mm"))

    max_temps = []
    min_temps = []
    avg_temps = []
    humidity_list = []
    rainfall_list = []

    for day in forecast_days:
        day_block = day.get("day", {})

        max_temps.append(safe_float(day_block.get("maxtemp_c")))
        min_temps.append(safe_float(day_block.get("mintemp_c")))
        avg_temps.append(safe_float(day_block.get("avgtemp_c")))
        humidity_list.append(safe_float(day_block.get("avghumidity")))
        rainfall_list.append(safe_float(day_block.get("totalprecip_mm")))

    if not forecast_days:
        weekly_rainfall = current_precip * 7
        avg_temp_week = current_temp
        max_temp_week = current_temp
        min_temp_week = current_temp
        avg_humidity_week = current_humidity
    else:
        weekly_rainfall = sum(rainfall_list)

        avg_temp_week = (
            sum(avg_temps) / len(avg_temps)
            if avg_temps else current_temp
        )

        max_temp_week = max(max_temps) if max_temps else current_temp
        min_temp_week = min(min_temps) if min_temps else current_temp

        avg_humidity_week = (
            sum(humidity_list) / len(humidity_list)
            if humidity_list else current_humidity
        )

    # ------------------------------------------
    # Stabilized Monthly Rainfall Estimation
    # ------------------------------------------

    api_monthly_estimate = (weekly_rainfall / 7.0) * 30.0 if weekly_rainfall > 0 else 0

    baseline = REGION_RAINFALL_BASELINE.get(region.lower(), 80)

    # Blend 60% API + 40% baseline
    monthly_estimated_rainfall = (0.6 * api_monthly_estimate) + (0.4 * baseline)

    # Prevent unrealistic collapse
    monthly_estimated_rainfall = max(monthly_estimated_rainfall, baseline * 0.4)

    weather_features = {
        "current_temperature": round(current_temp, 2),
        "weekly_avg_temperature": round(avg_temp_week, 2),
        "weekly_max_temperature": round(max_temp_week, 2),
        "weekly_min_temperature": round(min_temp_week, 2),
        "weekly_avg_humidity": round(avg_humidity_week, 2),
        "estimated_monthly_rainfall": round(monthly_estimated_rainfall, 2)
    }

    print("Processed Weather Features:")
    print(weather_features)

    return weather_features
