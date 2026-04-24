"use client"

import { useState } from 'react'
import { predictMaintenance, generateRandomValues } from '@/utils/api'
import type { PredictionResponse } from '@/app/types/api'

interface Props {
  machineId: string;
}

export default function PredictionView({ machineId }: Props) {
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    try {
      setLoading(true)
      const sensorData = await generateRandomValues(machineId)
      const result = await predictMaintenance(sensorData)
      setPrediction(result)
    } catch (error) {
      console.error('Prediction failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Generating prediction...</div>

  return (
    <div className="p-4">
      <h2>Maintenance Prediction</h2>
      <button 
        onClick={handlePredict}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Prediction
      </button>

      {prediction && (
        <div className="mt-4 space-y-4">
          <p>RUL: {prediction.RUL_prediction} hours</p>
          <p>Status: {prediction.maintenance_prediction}</p>
          <p>Anomaly: {prediction.anomaly_detection}</p>
          <p>Urgency: {prediction.urgency}</p>
          <p>Next Maintenance: {prediction.next_maintenance_date}</p>
        </div>
      )}
    </div>
  )
}
