const API_BASE = "http://127.0.0.1:5000";

export interface WeatherResponse {
  temp: number;
  humidity: number;
  rainfall: number;
  condition: string;
}

export async function getWeather(location: string): Promise<WeatherResponse> {
  const response = await fetch(
    `${API_BASE}/weather?city=${encodeURIComponent(location)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();

  return {
    temp: data.temperature_c,
    humidity: data.humidity,
    rainfall: data.rainfall,
    condition: data.condition
  };
}
