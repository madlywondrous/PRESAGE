// User and authentication types
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "engineer" | "technician" | "viewer"
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Machine and equipment types
export interface Machine {
  id: string
  name: string
  type: string
  location: string
  installDate: string
  status: "operational" | "warning" | "critical" | "maintenance"
  healthScore: number
  lastMaintenance: string
  nextMaintenance: string
}

export interface Component {
  id: string
  machineId: string
  name: string
  type: string
  status: "good" | "warning" | "critical"
  healthScore: number
  rul: number
}

// Sensor and data types
export interface SensorReading {
  id: string
  timestamp: string
  machineId: string
  sensor_1: number
  sensor_2: number
  sensor_3: number
  operational_hours: number
  temperature?: number
  vibration?: number
  pressure?: number
  noise?: number
}

export interface MaintenanceRecord {
  id: string
  machineId: string
  date: string
  type: "preventive" | "corrective" | "predictive"
  description: string
  technician: string
  cost: number
  duration: number
  parts: MaintenancePart[]
}

export interface MaintenancePart {
  id: string
  name: string
  quantity: number
  cost: number
}

export interface Alert {
  id: string
  machineId: string
  timestamp: string
  type: "warning" | "critical" | "info"
  message: string
  acknowledged: boolean
}

export interface PredictionResult {
  RUL: number
  maintenanceStatus: string
  anomalyDetection: string
  confidenceInterval?: {
    lower: number
    upper: number
  }
  components?: {
    name: string
    status: string
    rul: number
  }[]
  rootCause?: string[]
  recommendedActions?: string[]
  estimatedCost?: {
    parts: number
    labor: number
    downtime: number
    total: number
  }
}

export interface FeatureImportance {
  name: string
  value: number
}

export interface EnergyData {
  id: string
  machineId: string
  timestamp: string
  consumption: number
  efficiency: number
  cost: number
}

// Dashboard and UI types
export interface DashboardStats {
  totalMachines: number
  healthyMachines: number
  warningMachines: number
  criticalMachines: number
  averageHealthScore: number
  pendingMaintenances: number
  activeAlerts: number
  monthlyMaintenanceCost: number
}

export interface ChartData {
  name: string
  value: number
  [key: string]: any
}

