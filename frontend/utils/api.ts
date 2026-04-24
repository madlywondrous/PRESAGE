import type {
  Machine,
  Component,
  SensorReading,
  MaintenanceRecord,
  Alert,
  PredictionResult,
  FeatureImportance,
  EnergyData,
  DashboardStats,
} from "@/types"
import { SensorData, MaintenanceSchedule, MachineDetails, MaintenanceHistory, AlertSettings, PredictionResponse, DashboardSummary } from "@/app/types/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const handleApiError = (error: any) => {
  console.error("API Error:", error)
  throw error
}

export const fetchHistoricalData = async (limit = 100): Promise<any[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/historical-data?limit=${limit}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getMachines = async (): Promise<Machine[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-list`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    const data = await response.json()
    return data.map((machine: any) => {
      // Map backend status to frontend enum
      const rawStatus = (machine.status || '').toLowerCase()
      let status: Machine['status'] = 'operational'
      if (rawStatus.includes('maintenance') || rawStatus.includes('requires')) {
        status = machine.health < 50 ? 'critical' : 'warning'
      }

      return {
        id: machine.id.toString(),
        name: machine.name,
        type: machine.type || "Industrial Equipment",
        location: machine.location || "Factory Floor",
        installDate: "2023-01-01",
        status,
        healthScore: machine.health,
        lastMaintenance: machine.last_maintenance,
        nextMaintenance: machine.next_maintenance || "Pending",
        operationalHours: machine.operational_hours,
      }
    })
  } catch (error) {
    return handleApiError(error)
  }
}

export const getMachineDetails = async (machineId: string): Promise<MachineDetails> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-details/${machineId}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getAlertSettings = async (machineId: string): Promise<AlertSettings[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alert-settings?machine_id=${machineId}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const createAlertSetting = async (setting: AlertSettings): Promise<AlertSettings> => {
  try {
    const response = await fetch(`${API_BASE_URL}/alert-settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(setting)
    })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getMachineAlerts = async (machineId: string): Promise<Alert[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/threshold-alerts`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    const data = await response.json()
    // Filter by machine and transform to Alert shape
    return data
      .filter((a: any) => String(a.machine_id) === machineId)
      .map((a: any, idx: number) => ({
        id: `${a.machine_id}-${a.sensor}-${idx}`,
        machineId: String(a.machine_id),
        timestamp: a.timestamp || new Date().toISOString(),
        type: a.type === 'high' ? 'critical' as const : 'warning' as const,
        message: `${a.sensor} reading ${a.value?.toFixed(2)} exceeded ${a.type} threshold (${a.threshold})`,
        acknowledged: false,
      }))
  } catch (error) {
    return handleApiError(error)
  }
}

export const getMaintenanceHistory = async (machineId: string): Promise<MaintenanceHistory[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/maintenance-history?machine_id=${machineId}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const addMaintenanceRecord = async (
  machineId: number,
  date: string,
  technician: string,
  description: string,
  parts_replaced: string[] = [],
  cost: number = 0
): Promise<MaintenanceHistory> => {
  try {
    const response = await fetch(`${API_BASE_URL}/maintenance-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        machine_id: machineId,
        date,
        technician,
        description,
        parts_replaced,
        cost
      })
    })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getMaintenanceSchedules = async (machineId: string): Promise<MaintenanceSchedule[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/maintenance-schedules?machine_id=${machineId}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const createMaintenanceSchedule = async (schedule: MaintenanceSchedule): Promise<MaintenanceSchedule> => {
  try {
    const response = await fetch(`${API_BASE_URL}/maintenance-schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule)
    })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getMachineSensorReadings = async (machineId: string, limit = 100): Promise<SensorReading[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/historical-data?machine_id=${machineId}&limit=${limit}`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    const data = await response.json()
    
    // Transform the data to match the SensorReading interface
    return data.map((reading: any) => ({
      id: `${reading.machine_id}-${reading.timestamp || new Date().toISOString()}`,
      machineId: reading.machine_id.toString(),
      timestamp: reading.timestamp || new Date().toISOString(),
      sensor1: reading.sensor_1,
      sensor2: reading.sensor_2,
      sensor3: reading.sensor_3,
      operationalHours: reading.operational_hours
    }))
  } catch (error) {
    return handleApiError(error)
  }
}

export const predictMaintenance = async (sensorData: SensorData | number[]): Promise<PredictionResponse> => {
  try {
    // Support both array and object forms of sensor data
    const payload: SensorData = Array.isArray(sensorData)
      ? { sensor_1: sensorData[0], sensor_2: sensorData[1], sensor_3: sensorData[2], operational_hours: sensorData[3] }
      : sensorData

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard-summary`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [summaryRes, alertsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/dashboard-summary`),
      fetch(`${API_BASE_URL}/threshold-alerts`),
    ])
    if (!summaryRes.ok) throw new Error(`HTTP error! Status: ${summaryRes.status}`)
    const summary = await summaryRes.json()
    const alerts = alertsRes.ok ? await alertsRes.json() : []

    return {
      totalMachines: summary.total_machines,
      healthyMachines: summary.machines_healthy,
      warningMachines: summary.machines_needing_maintenance,
      criticalMachines: summary.machines_needing_maintenance,
      averageHealthScore: Math.round(Math.min(100, Math.max(0, 100 - (100 / Math.max(1, summary.average_rul))))),
      pendingMaintenances: summary.machines_needing_maintenance,
      activeAlerts: alerts.length,
      monthlyMaintenanceCost: 0,
    }
  } catch (error) {
    return handleApiError(error)
  }
}

export const getFeatureImportance = async (): Promise<FeatureImportance> => {
  try {
    const response = await fetch(`${API_BASE_URL}/feature-importance`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const generateRandomValues = async (machineId?: string): Promise<SensorData> => {
  try {
    const url = machineId 
      ? `${API_BASE_URL}/generate-random-values?machine_id=${machineId}`
      : `${API_BASE_URL}/generate-random-values`
    
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

export const updateMachineDetails = async (machineId: string, details: Partial<MachineDetails>): Promise<MachineDetails> => {
  try {
    const response = await fetch(`${API_BASE_URL}/machine-details/${machineId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    })
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
    return await response.json()
  } catch (error) {
    return handleApiError(error)
  }
}

