export interface SensorData {
  sensor_1: number;
  sensor_2: number;
  sensor_3: number;
  operational_hours: number;
  machine_id?: number;
}

export interface MachineDetails {
  id: number;
  name: string;
  location: string;
  type: string;
  notes: string;
  manufacturer: string;
  sensor_data: SensorData;
  health_status: {
    status: string;
    rul: number;
    health_percentage: number;
    next_maintenance_date: string;
  };
  maintenance_history: MaintenanceHistory[];
  upcoming_maintenance: MaintenanceSchedule[];
}

export interface MaintenanceHistory {
  machine_id: number;
  date: string;
  technician: string;
  description: string;
  parts_replaced: string[];
  cost: number;
}

export interface MaintenanceSchedule {
  machine_id: number;
  date: string;
  description: string;
  status: "Pending" | "Scheduled" | "Completed";
}

export interface AlertSettings {
  machine_id: number;
  sensor: string;
  high_threshold: number;
  low_threshold: number;
}

export interface PredictionResponse {
  machine_id: number;
  RUL_prediction: number;
  maintenance_prediction: string;
  anomaly_detection: string;
  urgency: string;
  next_maintenance_date: string;
}

export interface DashboardSummary {
  total_machines: number;
  machines_needing_maintenance: number;
  machines_healthy: number;
  average_rul: number;
  maintenance_prediction_summary: {
    healthy: number;
    maintenance_needed: number;
  };
}
