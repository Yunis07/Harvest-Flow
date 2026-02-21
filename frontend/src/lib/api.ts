// src/api/api.ts

const BASE_URL = "http://127.0.0.1:5000";

export interface PredictRequest {
  region: string;
  N: number;
  P: number;
  K: number;
  ph: number;
}

export interface PredictResponse {
  crop: string;
  weatherFactors: {
    temperature: number;
    humidity: number;
    rainfall: number;
  };
}

// Generic POST helper
async function postRequest<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let errorMessage = "Server error";
    try {
      const text = await response.text();
      errorMessage = text || errorMessage;
    } catch {
      errorMessage = "Unknown error";
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Crop prediction API
export async function predictCrop(
  data: PredictRequest
): Promise<PredictResponse> {
  return postRequest<PredictResponse>("/predict", data);
}
