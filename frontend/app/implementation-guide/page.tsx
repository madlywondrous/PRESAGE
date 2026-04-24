import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code } from "@/components/ui/code"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, CodeIcon, Server, Database, Cpu } from "lucide-react"

export default function ImplementationGuidePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Implementation Guide</h1>
          <p className="text-muted-foreground">How to connect your Python backend to this dashboard</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <CodeIcon className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="backend" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              Backend Setup
            </TabsTrigger>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              ML Models
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Data Storage
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Architecture</CardTitle>
                <CardDescription>Overview of the predictive maintenance system architecture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This dashboard is designed to work with your Python-based predictive maintenance model. The system
                  consists of three main components:
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <CodeIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Frontend Dashboard</h4>
                      <p className="text-sm text-muted-foreground">
                        Next.js-based UI for data visualization and interaction
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <Server className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Python Backend API</h4>
                      <p className="text-sm text-muted-foreground">
                        FastAPI or Flask server that hosts your ML models and processes data
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <Database className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Database</h4>
                      <p className="text-sm text-muted-foreground">
                        Storage for historical sensor data and prediction results
                      </p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important Note</AlertTitle>
                  <AlertDescription>
                    The dashboard currently uses simulated data and models. To use your actual predictive maintenance
                    models, you'll need to connect it to your Python backend.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Implementation Steps</CardTitle>
                <CardDescription>High-level steps to implement the complete system</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 list-decimal list-inside">
                  <li className="pl-2">
                    <span className="font-medium">Set up the Python backend server</span>
                    <p className="mt-1 text-sm text-muted-foreground pl-6">
                      Create a FastAPI or Flask server to host your ML models and expose API endpoints
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Implement the ML model endpoints</span>
                    <p className="mt-1 text-sm text-muted-foreground pl-6">
                      Create API endpoints for data processing, RUL prediction, and anomaly detection
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Set up the database</span>
                    <p className="mt-1 text-sm text-muted-foreground pl-6">
                      Configure a database to store sensor data, predictions, and maintenance records
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Update the frontend configuration</span>
                    <p className="mt-1 text-sm text-muted-foreground pl-6">
                      Configure the dashboard to connect to your backend API endpoints
                    </p>
                  </li>
                  <li className="pl-2">
                    <span className="font-medium">Deploy the system</span>
                    <p className="mt-1 text-sm text-muted-foreground pl-6">
                      Deploy the frontend, backend, and database to your preferred hosting environment
                    </p>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="backend" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Python Backend Setup</CardTitle>
                <CardDescription>How to set up the Python backend server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  The backend server is responsible for processing sensor data, running ML models, and providing
                  predictions to the frontend. We recommend using FastAPI for its performance and ease of use.
                </p>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="text-sm font-medium mb-2">Example FastAPI Backend</h4>
                  <Code className="text-xs">
                    {`# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
from typing import List, Optional
import joblib

# Load your trained models
rul_model = joblib.load('models/rul_model.pkl')
maintenance_model = joblib.load('models/maintenance_model.pkl')
anomaly_model = joblib.load('models/anomaly_model.pkl')

app = FastAPI(title="PRESAGE API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SensorData(BaseModel):
    sensor_1: float
    sensor_2: float
    sensor_3: float
    operational_hours: float

class PredictionResult(BaseModel):
    rul: float
    maintenance_status: str
    anomaly_detection: str

@app.post("/predict", response_model=PredictionResult)
async def predict(data: SensorData):
    try:
        # Prepare input data
        features = np.array([
            [data.sensor_1, data.sensor_2, data.sensor_3, data.operational_hours]
        ])
        
        # Make predictions
        rul_prediction = float(rul_model.predict(features)[0])
        maintenance_prediction = maintenance_model.predict(features)[0]
        anomaly_prediction = anomaly_model.predict(features)[0]
        
        # Format results
        maintenance_status = "Needs Maintenance" if maintenance_prediction == 1 else "Normal"
        anomaly_status = "Anomaly" if anomaly_prediction == 1 else "Normal"
        
        return {
            "rul": rul_prediction,
            "maintenance_status": maintenance_status,
            "anomaly_detection": anomaly_status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/historical-data")
async def get_historical_data():
    try:
        # Load data from your database or CSV file
        df = pd.read_csv('data/machinery_data.csv')
        return df.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`}
                  </Code>
                </div>

                <Alert variant="default" className="bg-primary/10 border-primary/20">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <AlertTitle>Installation Requirements</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">Install the required Python packages:</p>
                    <Code className="text-xs">pip install fastapi uvicorn pandas numpy scikit-learn joblib</Code>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Key API endpoints to implement in your backend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h4 className="text-sm font-medium">POST /predict</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Processes sensor data and returns RUL, maintenance status, and anomaly detection
                    </p>
                    <div className="mt-2">
                      <p className="text-xs font-medium">Request Body:</p>
                      <Code className="text-xs mt-1">
                        {`{
  "sensor_1": 0.5,
  "sensor_2": -1.2,
  "sensor_3": 0.8,
  "operational_hours": 5000
}`}
                      </Code>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-medium">Response:</p>
                      <Code className="text-xs mt-1">
                        {`{
  "rul": 245.6,
  "maintenance_status": "Normal",
  "anomaly_detection": "Normal"
}`}
                      </Code>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <h4 className="text-sm font-medium">GET /historical-data</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Returns historical sensor data and maintenance records
                    </p>
                    <div className="mt-2">
                      <p className="text-xs font-medium">Response:</p>
                      <Code className="text-xs mt-1">
                        {`[
  {
    "id": 1,
    "operational_hours": 100,
    "sensor_1": 0.5,
    "sensor_2": -1.2,
    "sensor_3": 0.8,
    "RUL": 450.2,
    "maintenance": 0,
    "maintenance_status": "Normal"
  },
  ...
]`}
                      </Code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="models" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ML Models Integration</CardTitle>
                <CardDescription>How to integrate your machine learning models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>The dashboard is designed to work with three main types of models:</p>

                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h4 className="font-medium">RUL Prediction Model</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Predicts the Remaining Useful Life of the machinery based on sensor readings
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Example Implementation:</p>
                      <Code className="text-xs mt-1">
                        {`# Train RUL prediction model
from sklearn.ensemble import RandomForestRegressor

# Prepare your training data
X_train = df[['sensor_1', 'sensor_2', 'sensor_3', 'operational_hours']]
y_train = df['RUL']

# Train the model
rul_model = RandomForestRegressor(n_estimators=100, random_state=42)
rul_model.fit(X_train, y_train)

# Save the model
import joblib
joblib.dump(rul_model, 'models/rul_model.pkl')`}
                      </Code>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <h4 className="font-medium">Maintenance Classification Model</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Classifies whether maintenance is needed based on sensor readings
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Example Implementation:</p>
                      <Code className="text-xs mt-1">
                        {`# Train maintenance classification model
from sklearn.ensemble import RandomForestClassifier

# Prepare your training data
X_train = df[['sensor_1', 'sensor_2', 'sensor_3', 'operational_hours']]
y_train = df['maintenance']  # Binary: 0 = normal, 1 = needs maintenance

# Train the model
maintenance_model = RandomForestClassifier(n_estimators=100, random_state=42)
maintenance_model.fit(X_train, y_train)

# Save the model
joblib.dump(maintenance_model, 'models/maintenance_model.pkl')`}
                      </Code>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <h4 className="font-medium">Anomaly Detection Model</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Detects anomalies in sensor readings that might indicate unusual behavior
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Example Implementation:</p>
                      <Code className="text-xs mt-1">
                        {`# Train anomaly detection model
from sklearn.cluster import KMeans

# Prepare your training data
X_train = df[['sensor_1', 'sensor_2', 'sensor_3']]

# Train the model
anomaly_model = KMeans(n_clusters=2, random_state=42)
anomaly_model.fit(X_train)

# Save the model
joblib.dump(anomaly_model, 'models/anomaly_model.pkl')`}
                      </Code>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Model Evaluation</AlertTitle>
                  <AlertDescription>
                    Remember to evaluate your models using appropriate metrics before deploying them. For RUL
                    prediction, consider using MAE or RMSE. For maintenance classification, use accuracy, precision, and
                    recall.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Storage Options</CardTitle>
                <CardDescription>Options for storing historical data and predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>You have several options for storing your machinery data and prediction results:</p>

                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h4 className="font-medium">SQL Database</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Suitable for structured data with relationships
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Example with PostgreSQL:</p>
                      <Code className="text-xs mt-1">
                        {`# database.py
from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

DATABASE_URL = "postgresql://username:password@localhost/predictive_maintenance"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class SensorReading(Base):
    __tablename__ = "sensor_readings"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    machine_id = Column(String)
    operational_hours = Column(Float)
    sensor_1 = Column(Float)
    sensor_2 = Column(Float)
    sensor_3 = Column(Float)
    
class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    machine_id = Column(String)
    rul = Column(Float)
    maintenance_needed = Column(Integer)  # 0 or 1
    anomaly_detected = Column(Integer)    # 0 or 1

# Create tables
Base.metadata.create_all(bind=engine)`}
                      </Code>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <h4 className="font-medium">NoSQL Database</h4>
                    <p className="text-sm text-muted-foreground mt-1">Good for flexible schema and high-volume data</p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Example with MongoDB:</p>
                      <Code className="text-xs mt-1">
                        {`# mongodb_example.py
from pymongo import MongoClient
import datetime

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["predictive_maintenance"]
sensor_readings = db["sensor_readings"]
predictions = db["predictions"]

# Example: Insert sensor reading
def insert_sensor_reading(machine_id, operational_hours, sensor_1, sensor_2, sensor_3):
    reading = {
        "timestamp": datetime.datetime.utcnow(),
        "machine_id": machine_id,
        "operational_hours": operational_hours,
        "sensor_1": sensor_1,
        "sensor_2": sensor_2,
        "sensor_3": sensor_3
    }
    return sensor_readings.insert_one(reading)

# Example: Insert prediction
def insert_prediction(machine_id, rul, maintenance_needed, anomaly_detected):
    prediction = {
        "timestamp": datetime.datetime.utcnow(),
        "machine_id": machine_id,
        "rul": rul,
        "maintenance_needed": maintenance_needed,
        "anomaly_detected": anomaly_detected
    }
    return predictions.insert_one(prediction)`}
                      </Code>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <h4 className="font-medium">Time Series Database</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Optimized for time-series data like sensor readings
                    </p>
                    <div className="mt-2">
                      <p className="text-sm font-medium">Example with InfluxDB:</p>
                      <Code className="text-xs mt-1">
                        {`# influxdb_example.py
from influxdb_client import InfluxDBClient, Point
from influxdb_client.client.write_api import SYNCHRONOUS
import datetime

# Connect to InfluxDB
client = InfluxDBClient(url="http://localhost:8086", token="your-token", org="your-org")
write_api = client.write_api(write_options=SYNCHRONOUS)
query_api = client.query_api()

# Example: Write sensor reading
def write_sensor_reading(machine_id, operational_hours, sensor_1, sensor_2, sensor_3):
    point = Point("sensor_reading") \\
        .tag("machine_id", machine_id) \\
        .field("operational_hours", operational_hours) \\
        .field("sensor_1", sensor_1) \\
        .field("sensor_2", sensor_2) \\
        .field("sensor_3", sensor_3) \\
        .time(datetime.datetime.utcnow())
    
    write_api.write(bucket="predictive_maintenance", record=point)

# Example: Query recent readings
def get_recent_readings(machine_id, limit=100):
    query = f'''
    from(bucket: "predictive_maintenance")
        |> range(start: -7d)
        |> filter(fn: (r) => r._measurement == "sensor_reading")
        |> filter(fn: (r) => r.machine_id == "{machine_id}")
        |> limit(n: {limit})
    '''
    return query_api.query(query)`}
                      </Code>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frontend Integration</CardTitle>
                <CardDescription>How to connect the frontend dashboard to your backend</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Once your backend is set up, you'll need to update the frontend to connect to your API endpoints.
                  Here's how to do it:
                </p>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="text-sm font-medium mb-2">Update API Configuration</h4>
                  <p className="text-xs mb-2">Create or modify the API configuration file:</p>
                  <Code className="text-xs">
                    {`// utils/api-config.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  predict: \`\${API_BASE_URL}/predict\`,
  historicalData: \`\${API_BASE_URL}/historical-data\`,
};

// Example API call function
export async function fetchPrediction(sensorData: {
  sensor_1: number;
  sensor_2: number;
  sensor_3: number;
  operational_hours: number;
}) {
  const response = await fetch(API_ENDPOINTS.predict, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sensorData),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch prediction');
  }

  return response.json();
}

export async function fetchHistoricalData() {
  const response = await fetch(API_ENDPOINTS.historicalData);

  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }

  return response.json();
}`}
                  </Code>
                </div>

                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Environment Variables</AlertTitle>
                  <AlertDescription>
                    <p>Create a .env.local file in your project root with your API URL:</p>
                    <Code className="text-xs mt-1">NEXT_PUBLIC_API_URL=http://your-api-server:8000</Code>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

