"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Timer, Activity, AlertTriangle } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { predictMaintenance } from "@/utils/api"

export default function RULAnalysisPage() {
  const [inputFeatures, setInputFeatures] = useState<number[] | null>(null)
  const [prediction, setPrediction] = useState<{
    RUL: number
    maintenanceStatus: string
    anomalyDetection: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load input features from localStorage
  useEffect(() => {
    const loadFeatures = () => {
      const storedFeatures = localStorage.getItem("inputFeatures")
      if (storedFeatures) {
        setInputFeatures(JSON.parse(storedFeatures))
      }
    }

    // Load on initial render
    loadFeatures()

    // Also listen for changes
    window.addEventListener("storage", loadFeatures)
    return () => window.removeEventListener("storage", loadFeatures)
  }, [])

  // Make prediction when input features change
  useEffect(() => {
    if (inputFeatures) {
      const makePrediction = async () => {
        try {
          setIsLoading(true)
          // Check if we already have a prediction in localStorage
          const storedPrediction = localStorage.getItem("prediction")
          if (storedPrediction) {
            setPrediction(JSON.parse(storedPrediction))
            setIsLoading(false)
            return
          }

          // Otherwise, make a new prediction
          const result = await predictMaintenance(inputFeatures)
          setPrediction(result)
          // Store the prediction in localStorage
          localStorage.setItem("prediction", JSON.stringify(result))
          setIsLoading(false)
        } catch (error) {
          console.error("Error making prediction:", error)
          setIsLoading(false)
          alert("Error making prediction. Please try again.")
        }
      }

      makePrediction()
    }
  }, [inputFeatures])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-500"
      case "Warning":
        return "bg-yellow-500"
      case "Needs Maintenance":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Normal":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Normal
          </Badge>
        )
      case "Warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="mr-1 h-3 w-3" /> Warning
          </Badge>
        )
      case "Needs Maintenance":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" /> Needs Maintenance
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getAnomalyBadge = (status: string) => {
    switch (status) {
      case "Normal":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Normal
          </Badge>
        )
      case "Anomaly":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="mr-1 h-3 w-3" /> Anomaly
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Calculate health score based on RUL (simplified)
  const calculateHealthScore = (rul: number) => {
    return Math.min(100, Math.max(0, (rul / 500) * 100))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">RUL Analysis</h1>
          <p className="text-muted-foreground">Remaining Useful Life analysis and health indicators</p>
        </div>

        {!inputFeatures && (
          <Alert variant="destructive" className="animate-slide-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No input data</AlertTitle>
            <AlertDescription>
              Please go to the Data Input page to enter or generate sensor data first.
              <div className="mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = "/data-input")}
                  className="btn-hover"
                >
                  Go to Data Input
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12">
            <LoadingSpinner size="lg" text="Analyzing sensor data and calculating predictions..." />
          </div>
        )}

        {prediction && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">RUL Estimate</CardTitle>
                  <Timer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{prediction.RUL.toFixed(2)} hours</div>
                  <p className="text-xs text-muted-foreground">Based on current operating conditions</p>
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calculateHealthScore(prediction.RUL).toFixed(1)}%</div>
                  <Progress value={calculateHealthScore(prediction.RUL)} className="mt-2 transition-all" />
                </CardContent>
              </Card>
              <Card className="transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Maintenance Status</CardTitle>
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(prediction.maintenanceStatus)}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{getStatusBadge(prediction.maintenanceStatus)}</div>
                  <p className="text-xs text-muted-foreground">
                    {prediction.maintenanceStatus === "Needs Maintenance"
                      ? "Maintenance required soon"
                      : "No maintenance required at this time"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Prediction Details</CardTitle>
                <CardDescription>Detailed analysis of the machine condition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-medium">Input Features</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sensor 1:</span>
                        <span className="font-medium">{inputFeatures?.[0].toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sensor 2:</span>
                        <span className="font-medium">{inputFeatures?.[1].toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sensor 3:</span>
                        <span className="font-medium">{inputFeatures?.[2].toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Operational Hours:</span>
                        <span className="font-medium">{inputFeatures?.[3].toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Prediction Results</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Remaining Useful Life:</span>
                        <span className="font-medium">{prediction.RUL.toFixed(2)} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Maintenance Status:</span>
                        <span>{getStatusBadge(prediction.maintenanceStatus)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Anomaly Detection:</span>
                        <span>{getAnomalyBadge(prediction.anomalyDetection)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Health Score:</span>
                        <span className="font-medium">{calculateHealthScore(prediction.RUL).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {prediction.maintenanceStatus === "Needs Maintenance" && (
                  <Alert className="bg-red-50 border-red-200 text-red-800 animate-slide-in">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle>Maintenance Required</AlertTitle>
                    <AlertDescription>
                      The machine is predicted to need maintenance soon. Schedule maintenance within the next{" "}
                      {Math.max(0, Math.ceil(prediction.RUL / 24))} days.
                    </AlertDescription>
                  </Alert>
                )}

                {prediction.anomalyDetection === "Anomaly" && (
                  <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 animate-slide-in">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <AlertTitle>Anomaly Detected</AlertTitle>
                    <AlertDescription>
                      Unusual sensor readings detected. Consider inspecting the machine for potential issues.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Suggested maintenance actions based on the prediction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prediction.maintenanceStatus === "Needs Maintenance" ? (
                    <>
                      <div className="rounded-lg border p-4 border-red-200 bg-red-50 transition-all hover:shadow-md">
                        <div className="flex items-start space-x-4">
                          <div className="mt-0.5 rounded-full bg-red-100 p-1 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-red-800">Schedule Maintenance</h4>
                            <p className="text-sm text-red-700">
                              Based on the current RUL estimate, maintenance should be scheduled soon. Plan for downtime
                              and prepare necessary parts and tools.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border p-4 transition-all hover:shadow-md hover:bg-accent/50">
                        <div className="flex items-start space-x-4">
                          <div className="mt-0.5 rounded-full bg-blue-100 p-1 text-blue-600">
                            <Activity className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">Increase Monitoring Frequency</h4>
                            <p className="text-sm text-muted-foreground">
                              Increase the frequency of sensor data collection and analysis to track any rapid changes
                              in machine condition.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-lg border p-4 border-green-200 bg-green-50 transition-all hover:shadow-md">
                      <div className="flex items-start space-x-4">
                        <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-600">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-green-800">Continue Normal Operation</h4>
                          <p className="text-sm text-green-700">
                            Based on the current RUL estimate, no immediate maintenance is required. Continue regular
                            monitoring and scheduled inspections.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {prediction.anomalyDetection === "Anomaly" && (
                    <div className="rounded-lg border p-4 border-yellow-200 bg-yellow-50 transition-all hover:shadow-md animate-slide-in">
                      <div className="flex items-start space-x-4">
                        <div className="mt-0.5 rounded-full bg-yellow-100 p-1 text-yellow-600">
                          <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-yellow-800">Investigate Anomaly</h4>
                          <p className="text-sm text-yellow-700">
                            Unusual sensor readings detected. Perform a visual inspection of the machine and check for
                            any irregularities in operation or unusual sounds.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

