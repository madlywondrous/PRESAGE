"use client"

import { useEffect, useState } from 'react'
import { getMaintenanceHistory } from '@/utils/api'
import type { MaintenanceHistory } from '@/app/types/api'

interface Props {
  machineId: string;
}

export default function MaintenanceHistory({ machineId }: Props) {
  const [history, setHistory] = useState<MaintenanceHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getMaintenanceHistory(machineId)
        setHistory(data)
      } catch (error) {
        console.error('Failed to fetch maintenance history:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [machineId])

  if (loading) return <div>Loading history...</div>

  return (
    <div className="p-4">
      <h2>Maintenance History</h2>
      <div className="space-y-4">
        {history.map((record, index) => (
          <div key={index} className="border p-4 rounded">
            <p>Date: {record.date}</p>
            <p>Technician: {record.technician}</p>
            <p>Description: {record.description}</p>
            <p>Cost: ${record.cost}</p>
            {record.parts_replaced.length > 0 && (
              <p>Parts Replaced: {record.parts_replaced.join(', ')}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
