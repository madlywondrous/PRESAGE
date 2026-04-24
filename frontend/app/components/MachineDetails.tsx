"use client"

import { useEffect, useState } from 'react'
import { getMachineDetails, getAlertSettings, getMaintenanceSchedules } from '@/utils/api'
import type { MachineDetails as MachineDetailsType, AlertSettings, MaintenanceSchedule } from '@/app/types/api'

interface Props {
  machineId: string;
}

export default function MachineDetails({ machineId }: Props) {
  const [machine, setMachine] = useState<MachineDetailsType | null>(null)
  const [alerts, setAlerts] = useState<AlertSettings[]>([])
  const [schedule, setSchedule] = useState<MaintenanceSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [machineData, alertsData, scheduleData] = await Promise.all([
          getMachineDetails(machineId),
          getAlertSettings(machineId),
          getMaintenanceSchedules(machineId)
        ])
        
        setMachine(machineData)
        setAlerts(alertsData)
        setSchedule(scheduleData)
      } catch (err) {
        setError('Failed to load machine data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [machineId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!machine) return <div>No machine found</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">{machine.name}</h1>
      <div className="grid grid-cols-2 gap-4">
        {/* Machine Info */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Machine Information</h2>
          <p>Location: {machine.location}</p>
          <p>Type: {machine.type}</p>
          <p>Manufacturer: {machine.manufacturer}</p>
          <p>Health: {machine.health_status.health_percentage}%</p>
          <p>Status: {machine.health_status.status}</p>
          <p>Next Maintenance: {machine.health_status.next_maintenance_date}</p>
        </div>

        {/* Alerts */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Alert Settings</h2>
          {alerts.length > 0 ? (
            alerts.map((alert, index) => (
              <div key={index} className="mb-2 p-2 border rounded">
                <p>Sensor: {alert.sensor}</p>
                <p>High Threshold: {alert.high_threshold}</p>
                <p>Low Threshold: {alert.low_threshold}</p>
              </div>
            ))
          ) : (
            <p>No alert settings configured</p>
          )}
        </div>

        {/* Maintenance Schedule */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Upcoming Maintenance</h2>
          {schedule.length > 0 ? (
            schedule.map((item, index) => (
              <div key={index} className="mb-2 p-2 border rounded">
                <p>{item.description}</p>
                <p>Date: {item.date}</p>
                <p>Status: {item.status}</p>
              </div>
            ))
          ) : (
            <p>No upcoming maintenance scheduled</p>
          )}
        </div>
      </div>
    </div>
  )
}
