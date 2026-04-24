// This is a simplified version of the ML models for frontend demonstration
// In a real implementation, these would be API calls to your Python backend

// Simulated data similar to your machinery_data.csv
const simulatedData = {
  sensor_1: { min: -2.5, max: 2.5, mean: 0 },
  sensor_2: { min: -3.0, max: 3.0, mean: 0 },
  sensor_3: { min: -2.0, max: 2.0, mean: 0 },
  operational_hours: { min: 0, max: 10000, mean: 5000 },
  RUL: { min: 0, max: 500, mean: 250 },
}

// Simulated prediction function
export function predictMaintenance(features: number[]) {
  // Simplified RUL prediction (in a real app, this would call your Python model)
  const rulPrediction = calculateRUL(features)

  // Simplified maintenance prediction
  const maintenancePrediction = rulPrediction < 100 ? "Needs Maintenance" : "Normal"

  // Simplified anomaly detection
  const isAnomaly = features.some((value, index) => {
    const featureKey = `sensor_${index + 1}` as keyof typeof simulatedData
    if (simulatedData[featureKey]) {
      return value > simulatedData[featureKey].max * 0.9 || value < simulatedData[featureKey].min * 0.9
    }
    return false
  })

  return {
    RUL: rulPrediction,
    maintenanceStatus: maintenancePrediction,
    anomalyDetection: isAnomaly ? "Anomaly" : "Normal",
  }
}

// Simplified RUL calculation
function calculateRUL(features: number[]) {
  // This is a very simplified model - in reality, you'd call your Python model
  const [sensor1, sensor2, sensor3, hours] = features

  // Higher sensor values and operational hours reduce RUL
  const baseRUL = 500
  const sensor1Impact = Math.abs(sensor1) * 20
  const sensor2Impact = Math.abs(sensor2) * 15
  const sensor3Impact = Math.abs(sensor3) * 25
  const hoursImpact = hours / 20

  const rul = baseRUL - sensor1Impact - sensor2Impact - sensor3Impact - hoursImpact
  return Math.max(0, Math.min(500, rul))
}

// Generate random values within the range of our simulated data
export function generateRandomValues() {
  return [
    Math.random() * (simulatedData.sensor_1.max - simulatedData.sensor_1.min) + simulatedData.sensor_1.min,
    Math.random() * (simulatedData.sensor_2.max - simulatedData.sensor_2.min) + simulatedData.sensor_2.min,
    Math.random() * (simulatedData.sensor_3.max - simulatedData.sensor_3.min) + simulatedData.sensor_3.min,
    Math.random() * (simulatedData.operational_hours.max - simulatedData.operational_hours.min) +
      simulatedData.operational_hours.min,
  ]
}

// Simulated historical data
export function getHistoricalData(count = 100) {
  const data = []
  for (let i = 0; i < count; i++) {
    const operationalHours = i * 100
    const sensor1 = Math.sin(i / 10) + (Math.random() * 0.5 - 0.25)
    const sensor2 = Math.cos(i / 8) + (Math.random() * 0.6 - 0.3)
    const sensor3 = Math.sin(i / 12 + 1) + (Math.random() * 0.4 - 0.2)

    const features = [sensor1, sensor2, sensor3, operationalHours]
    const rul = calculateRUL(features)
    const maintenanceNeeded = rul < 100

    data.push({
      id: i,
      operational_hours: operationalHours,
      sensor_1: sensor1,
      sensor_2: sensor2,
      sensor_3: sensor3,
      RUL: rul,
      maintenance: maintenanceNeeded ? 1 : 0,
      maintenance_status: maintenanceNeeded ? "Needs Maintenance" : "Normal",
    })
  }
  return data
}

// Get feature importance (simulated)
export function getFeatureImportance() {
  return [
    { name: "Sensor 1", value: 35 },
    { name: "Sensor 2", value: 25 },
    { name: "Sensor 3", value: 20 },
    { name: "Operational Hours", value: 20 },
  ]
}

