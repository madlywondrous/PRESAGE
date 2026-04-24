"use client"

import { useEffect, useState } from 'react'
import { getMachineSensorReadings } from '@/utils/api'
import type { SensorData } from '@/app/types/api'

interface Props {
  machineId: string;
}

export default function SensorReadings({ machineId }: Props) {
  const [readings, setReadings] = useState<SensorData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReadings() {
      try {
        const data = await getMachineSensorReadings(machineId)
        setReadings(data)
      } catch (error) {
        console.error('Failed to fetch sensor readings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReadings()
  }, [machineId])

  if (loading) return <div>Loading readings...</div>

  return (
    <div className="p-4">
      <h2>Sensor Readings</h2>
      <div className="grid grid-cols-2 gap-4">
        {readings.map((reading, index) => (
          <div key={index} className="border p-3 rounded">
            <p>Sensor 1: {reading.sensor_1}</p>
            <p>Sensor 2: {reading.sensor_2}</p>
            <p>Sensor 3: {reading.sensor_3}</p>
            <p>Operational Hours: {reading.operational_hours}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
