import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { BarChart3, CloudRain, Thermometer, Droplets } from "lucide-react";

interface Recommendation {
  crop: string;
  confidence_percent: number;
}

interface SelectedCropResult {
  crop: string;
  confidence_percent: number;
  risk_level: string;
}

interface WeatherInfo {
  temperature: number;
  humidity: number;
  rainfall: number;
}

const CROP_LIST = [
  "grapes","apple","muskmelon","papaya","banana","cotton",
  "chickpea","blackgram","coconut","coffee","jute",
  "kidneybeans","lentil","maize","mango","mothbeans",
  "mungbean","orange","pigeonpeas","pomegranate",
  "rice","watermelon","wheat","barley","soybean",
  "groundnut","mustard","tomato","potato","onion"
];

const CITY_LIST = [
  "Chennai","Coimbatore","Madurai","Thanjavur","Salem","Erode",
  "Tirunelveli","Trichy","Vellore","Thoothukudi","Kancheepuram",
  "Villupuram","Nagapattinam","Cuddalore","Krishnagiri",
  "Delhi","Mumbai","Kolkata","Bangalore","Hyderabad",
  "Pune","Nagpur","Jaipur","Ahmedabad","Lucknow",
  "Bhopal","Patna","Guwahati","Chandigarh","Raipur",
  "Ranchi","Kochi","Visakhapatnam","Surat","Indore",
  "Thiruvananthapuram","Vadodara","Ludhiana","Agra","Amritsar"
];

export function RiskEnginePage() {

  const [region, setRegion] = useState("Chennai");
  const [selectedCrop, setSelectedCrop] = useState("rice");
  const [loading, setLoading] = useState(false);

  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  const [selectedResult, setSelectedResult] = useState<SelectedCropResult | null>(null);
  const [topRecommendations, setTopRecommendations] = useState<Recommendation[]>([]);
  const [worstRecommendation, setWorstRecommendation] = useState<Recommendation | null>(null);
  const [engineInfo, setEngineInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {

    if (!region) {
      setError("Please select a region");
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherInfo(null);
    setSelectedResult(null);
    setTopRecommendations([]);
    setWorstRecommendation(null);
    setEngineInfo(null);

    try {
      const res = await fetch("http://localhost:5000/risk-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region: region,
          crop: selectedCrop
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Backend error");
      }

      setWeatherInfo(data.weather);
      setSelectedResult(data.selected_crop);
      setTopRecommendations(data.top_3_recommendations || []);
      setWorstRecommendation(data.worst_recommendation || null);
      setEngineInfo(data.engine);

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  const getRiskColor = (level: string) => {
    if (level === "Low") return "bg-green-600";
    if (level === "Medium") return "bg-yellow-500";
    if (level === "High") return "bg-orange-500";
    if (level === "Critical") return "bg-red-600";
    return "bg-gray-400";
  };

  const getDecisionInsight = () => {
    if (!selectedResult) return "";
    if (selectedResult.risk_level === "Low")
      return "This crop is highly suitable under current climatic conditions.";
    if (selectedResult.risk_level === "Medium")
      return "Moderate stability expected. Risk mitigation recommended.";
    if (selectedResult.risk_level === "High")
      return "High yield uncertainty detected. Consider alternatives.";
    if (selectedResult.risk_level === "Critical")
      return "Severe climate mismatch. Strongly advised to avoid.";
    return "";
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">

        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Risk Analysis Engine
          </h1>
          <p className="text-muted-foreground">
            Hybrid ML + Monte Carlo Crop Risk Engine
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="card-elevated p-6 space-y-4">

            <div>
              <Label>Region</Label>
              <select
                className="w-full h-11 border rounded-lg px-3 bg-background"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {CITY_LIST.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>Select Crop</Label>
              <select
                className="w-full h-11 border rounded-lg px-3 bg-background"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                {CROP_LIST.map((crop) => (
                  <option key={crop} value={crop}>
                    {crop}
                  </option>
                ))}
              </select>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={analyze}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Run Risk Analysis"}
            </Button>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
          </div>

          <div className="space-y-4">

            {weatherInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-elevated p-4"
              >
                <h2 className="font-semibold mb-2">Weather Snapshot</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Thermometer className="mx-auto mb-1" />
                    {weatherInfo.temperature}°C
                  </div>
                  <div>
                    <Droplets className="mx-auto mb-1" />
                    {weatherInfo.humidity}%
                  </div>
                  <div>
                    <CloudRain className="mx-auto mb-1" />
                    {weatherInfo.rainfall} mm
                  </div>
                </div>
              </motion.div>
            )}

            {selectedResult && (
              <div className={`card-elevated p-4 text-white font-bold ${getRiskColor(selectedResult.risk_level)}`}>
                <h2 className="mb-2">
                  Suitability for {selectedResult.crop.toUpperCase()}
                </h2>
                <p>Confidence: {selectedResult.confidence_percent}%</p>
                <p>Risk Level: {selectedResult.risk_level}</p>
                <p className="mt-2 text-sm font-normal">
                  {getDecisionInsight()}
                </p>
              </div>
            )}

            {topRecommendations.length > 0 && (
              <div className="card-elevated p-4">
                <h2 className="font-semibold mb-3">
                  Top 3 Recommended Crops
                </h2>

                <div className="space-y-4">
                  {topRecommendations.map((rec, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm font-semibold">
                        <span className="capitalize">{rec.crop}</span>
                        <span>{rec.confidence_percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${rec.confidence_percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {worstRecommendation && (
              <div className="card-elevated p-4 border border-red-500">
                <h2 className="font-semibold mb-2 text-red-600">
                  Highest Risk Crop
                </h2>
                <p className="capitalize font-semibold">
                  {worstRecommendation.crop}
                </p>
                <p>{worstRecommendation.confidence_percent}% confidence</p>
              </div>
            )}

            {engineInfo && (
              <p className="text-xs text-muted-foreground mt-4">
                Engine: {engineInfo}
              </p>
            )}

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
