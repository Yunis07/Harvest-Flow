import { useState } from "react"
import { predictCrop } from "@/lib/api"

export default function Predict() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    setLoading(true)

    const data = {
      N: 90,
      P: 42,
      K: 43,
      temperature: 20,
      humidity: 80,
      ph: 6.5,
      rainfall: 200
    }

    try {
      const res = await predictCrop(data)
      setResult(res.prediction)
    } catch (error) {
      console.error(error)
    }

    setLoading(false)
  }

  return (
    <div className="p-6">
      <button
        onClick={handlePredict}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Predict Crop
      </button>

      {loading && <p>Loading...</p>}
      {result && <p>Prediction: {result}</p>}
    </div>
  )
}
