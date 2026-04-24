"use client"

import { useEffect, useState } from 'react'
import { getAlertSettings } from '@/utils/api'
import type { AlertSettings } from '@/app/types/api'

interface Props {
  machineId: string;
}

export default function AlertsList({ machineId }: Props) {
  const [alerts, setAlerts] = useState<AlertSettings[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const data = await getAlertSettings(machineId)
        setAlerts(data)
      } catch (error) {
        console.error('Failed to fetch alerts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [machineId])

  if (loading) return <div>Loading alerts...</div>

  return (
    <div className="p-4">
      <h2>Machine Alerts</h2>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div 
            key={index}
            className={`p-3 rounded bg-yellow-100`}
          >
            <p>Sensor: {alert.sensor}</p>
            <p>High Threshold: {alert.high_threshold}</p>
            <p>Low Threshold: {alert.low_threshold}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
