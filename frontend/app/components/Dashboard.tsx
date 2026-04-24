"use client"

import { useEffect, useState } from 'react'
import { getDashboardSummary, getMachines } from '@/utils/api'
import type { DashboardSummary } from '@/app/types/api'
import type { Machine } from '@/types'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardSummary | null>(null)
  const [machines, setMachines] = useState<Machine[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [dashboardStats, machineList] = await Promise.all([
          getDashboardSummary(),
          getMachines()
        ])
        setStats(dashboardStats)
        setMachines(machineList)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) return <div>Loading dashboard...</div>
  if (!stats) return <div>No data available</div>

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div>
          <h3>Total Machines</h3>
          <p>{stats.total_machines}</p>
        </div>
        <div>
          <h3>Healthy</h3>
          <p>{stats.machines_healthy}</p>
        </div>
        <div>
          <h3>Needs Maintenance</h3>
          <p>{stats.machines_needing_maintenance}</p>
        </div>
        <div>
          <h3>Average RUL</h3>
          <p>{Math.round(stats.average_rul)} hours</p>
        </div>
      </div>

      {/* Machine List */}
      <div className="mt-6">
        <h2>Machines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map(machine => (
            <div key={machine.id} className="p-4 border rounded">
              <h3>{machine.name}</h3>
              <p>Status: {machine.status}</p>
              <p>Health: {machine.healthScore}%</p>
              <p>Next Maintenance: {machine.nextMaintenance}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
