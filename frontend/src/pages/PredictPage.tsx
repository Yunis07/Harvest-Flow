import { useState } from "react"
import { predictCrop } from "@/lib/api"

export default function PredictPage() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: ""
  })

  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await predictCrop({
        N: Number(formData.N),
        P: Number(formData.P),
        K: Number(formData.K),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall)
      })

      setResult(response.prediction)
    } catch (err) {
      setError("Prediction failed. Check backend connection.")
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Crop Prediction</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="number"
            name={key}
            placeholder={key}
            value={(formData as any)[key]}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />
        ))}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded"
        >
          {loading ? "Predicting..." : "Predict Crop"}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-green-100 rounded">
          <strong>Prediction:</strong> {result}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 rounded text-red-600">
          {error}
        </div>
      )}
    </div>
  )
}
