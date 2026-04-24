"use client"

import { useState } from 'react'
import { createMaintenanceSchedule } from '@/utils/api'
import type { MaintenanceSchedule } from '@/app/types/api'

interface Props {
  machineId: string;
}

export default function MaintenancePlanner({ machineId }: Props) {
  const [schedule, setSchedule] = useState<MaintenanceSchedule>({
    machine_id: parseInt(machineId),
    date: '',
    description: '',
    status: 'Pending'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createMaintenanceSchedule(schedule)
      // Reset form or show success message
      setSchedule({
        machine_id: parseInt(machineId),
        date: '',
        description: '',
        status: 'Pending'
      })
    } catch (error) {
      console.error('Failed to create maintenance schedule:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Machine ID</label>
        <input
          type="number"
          value={schedule.machine_id}
          onChange={e => setSchedule({...schedule, machine_id: Number(e.target.value)})}
          required
        />
      </div>

      <div>
        <label>Date</label>
        <input
          type="date"
          value={schedule.date}
          onChange={e => setSchedule({...schedule, date: e.target.value})}
          required
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={schedule.description}
          onChange={e => setSchedule({...schedule, description: e.target.value})}
          required
        />
      </div>

      <button type="submit">Schedule Maintenance</button>
    </form>
  )
}
