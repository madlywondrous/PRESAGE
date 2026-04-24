"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, RefreshCw, FileType, AlertCircle, Cpu } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { generateRandomValues, predictMaintenance } from "@/utils/api"

export default function DataInputPage() {
  const [file, setFile] = useState<File | null>(null)
  const [features, setFeatures] = useState({
    sensor_1: 0,
    sensor_2: 0,
    sensor_3: 0,
    operational_hours: 5000,
  })
  const [advancedFeatures, setAdvancedFeatures] = useState({
    air_temperature_k: 298.1,
    process_temperature_k: 308.6,
    rotational_speed_rpm: 1551,
    torque_nm: 42.8,
    tool_wear_min: 0,
    machine_type: "M",
  })
  const [advancedResult, setAdvancedResult] = useState<any>(null)
  const [generatedValues, setGeneratedValues] = useState<number[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleFeatureChange = (name: string, value: number[]) => {
    setFeatures((prev) => ({
      ...prev,
      [name]: value[0],
    }))
  }

  const handleGenerateRandomValues = async () => {
    try {
      setIsGenerating(true)
      const randomValues = await generateRandomValues()
      setGeneratedValues(randomValues)

      // Update the sliders with the generated values
      setFeatures({
        sensor_1: randomValues[0],
        sensor_2: randomValues[1],
        sensor_3: randomValues[2],
        operational_hours: randomValues[3],
      })
      setIsGenerating(false)
    } catch (error) {
      console.error("Error generating random values:", error)
      setIsGenerating(false)
      alert("Error generating random values. Please try again.")
    }
  }

  const handleUseGeneratedValues = async () => {
    if (generatedValues) {
      try {
        setIsSubmitting(true)
        const prediction = await predictMaintenance(generatedValues)
        // Store prediction in localStorage for use in results page
        localStorage.setItem("inputFeatures", JSON.stringify(generatedValues))
        localStorage.setItem("prediction", JSON.stringify(prediction))
        window.dispatchEvent(new Event("storage")) // Trigger storage event for other components
        setIsSubmitting(false)
        // Navigate to RUL analysis page
        window.location.href = "/rul-analysis"
      } catch (error) {
        console.error("Error making prediction:", error)
        setIsSubmitting(false)
        alert("Error making prediction. Please try again.")
      }
    }
  }

  const handleSubmitManualValues = async () => {
    try {
      setIsSubmitting(true)
      const manualValues = [features.sensor_1, features.sensor_2, features.sensor_3, features.operational_hours]
      const prediction = await predictMaintenance(manualValues)
      // Store values and prediction in localStorage
      localStorage.setItem("inputFeatures", JSON.stringify(manualValues))
      localStorage.setItem("prediction", JSON.stringify(prediction))
      window.dispatchEvent(new Event("storage")) // Trigger storage event for other components
      setIsSubmitting(false)
      // Navigate to RUL analysis page
      window.location.href = "/rul-analysis"
    } catch (error) {
      console.error("Error making prediction:", error)
      setIsSubmitting(false)
      alert("Error making prediction. Please try again.")
    }
  }

  const handleSubmitAdvancedValues = async () => {
    try {
      setIsSubmitting(true)
      const response = await fetch("http://localhost:8000/predict-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(advancedFeatures),
      })
      if (!response.ok) throw new Error("Failed to fetch advanced prediction")
      const data = await response.json()
      setAdvancedResult(data)
      setIsSubmitting(false)
    } catch (error) {
      console.error("Error making advanced prediction:", error)
      setIsSubmitting(false)
      alert("Error making advanced prediction. Please make sure the backend is running.")
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Data Input</h1>
          <p className="text-muted-foreground">
            Upload data or generate test data for your predictive maintenance model
          </p>
        </div>

        {(isLoading || isGenerating || isSubmitting) && (
          <Alert className="bg-primary/10 border-primary/20 animate-pulse-slow">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Processing</AlertTitle>
            <AlertDescription>
              {isGenerating
                ? "Generating random values..."
                : isSubmitting
                  ? "Submitting data for analysis..."
                  : "Processing your request. Please wait..."}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Data
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Generate Data
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Advanced ML
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload CSV File</CardTitle>
                <CardDescription>Upload a CSV file containing sensor data for analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileType className="w-10 h-10 mb-3 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">CSV files only (MAX. 10MB)</p>
                    </div>
                    <Input
                      id="dropzone-file"
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isLoading}
                    />
                  </label>
                </div>

                {file && (
                  <div className="p-4 mt-4 rounded-lg bg-muted animate-slide-in">
                    <div className="flex items-center">
                      <FileType className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setFile(null)} disabled={isLoading}>
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button disabled={!file || isLoading} className="btn-hover">
                    Process Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generate Test Data</CardTitle>
                <CardDescription>Adjust parameters to generate test data for your model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={handleGenerateRandomValues}
                    className="flex items-center gap-2 btn-hover"
                    disabled={isGenerating || isSubmitting}
                  >
                    <RefreshCw className={`h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                    Generate Random Values
                  </Button>
                </div>

                {generatedValues && (
                  <Alert className="bg-primary/10 border-primary/20 animate-slide-in">
                    <AlertTitle className="text-primary">Random Values Generated</AlertTitle>
                    <AlertDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          Sensor 1: <span className="font-medium">{generatedValues[0].toFixed(2)}</span>
                        </div>
                        <div>
                          Sensor 2: <span className="font-medium">{generatedValues[1].toFixed(2)}</span>
                        </div>
                        <div>
                          Sensor 3: <span className="font-medium">{generatedValues[2].toFixed(2)}</span>
                        </div>
                        <div>
                          Operational Hours: <span className="font-medium">{generatedValues[3].toFixed(2)}</span>
                        </div>
                      </div>
                      <Button
                        className="mt-2 btn-hover"
                        size="sm"
                        onClick={handleUseGeneratedValues}
                        disabled={isGenerating || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">Processing...</span>
                          </>
                        ) : (
                          "Use Generated Values"
                        )}
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sensor_1">Sensor 1</Label>
                      <span className="text-sm font-medium">{features.sensor_1.toFixed(2)}</span>
                    </div>
                    <Slider
                      id="sensor_1"
                      min={-2.5}
                      max={2.5}
                      step={0.01}
                      value={[features.sensor_1]}
                      onValueChange={(value) => handleFeatureChange("sensor_1", value)}
                      disabled={isGenerating || isSubmitting}
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sensor_2">Sensor 2</Label>
                      <span className="text-sm font-medium">{features.sensor_2.toFixed(2)}</span>
                    </div>
                    <Slider
                      id="sensor_2"
                      min={-3.0}
                      max={3.0}
                      step={0.01}
                      value={[features.sensor_2]}
                      onValueChange={(value) => handleFeatureChange("sensor_2", value)}
                      disabled={isGenerating || isSubmitting}
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sensor_3">Sensor 3</Label>
                      <span className="text-sm font-medium">{features.sensor_3.toFixed(2)}</span>
                    </div>
                    <Slider
                      id="sensor_3"
                      min={-2.0}
                      max={2.0}
                      step={0.01}
                      value={[features.sensor_3]}
                      onValueChange={(value) => handleFeatureChange("sensor_3", value)}
                      disabled={isGenerating || isSubmitting}
                      className="transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="operational_hours">Operational Hours</Label>
                      <span className="text-sm font-medium">{features.operational_hours.toFixed(0)}</span>
                    </div>
                    <Slider
                      id="operational_hours"
                      min={0}
                      max={10000}
                      step={10}
                      value={[features.operational_hours]}
                      onValueChange={(value) => handleFeatureChange("operational_hours", value)}
                      disabled={isGenerating || isSubmitting}
                      className="transition-all"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFeatures({
                        sensor_1: 0,
                        sensor_2: 0,
                        sensor_3: 0,
                        operational_hours: 5000,
                      })
                    }
                    disabled={isGenerating || isSubmitting}
                    className="btn-hover"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={handleSubmitManualValues}
                    disabled={isGenerating || isSubmitting}
                    className="btn-hover"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      "Submit Values"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced ML Prediction</CardTitle>
                <CardDescription>Input detailed machinery metrics to predict failure types and repair costs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="machine_type">Machine Type (L/M/H)</Label>
                    <Select
                      value={advancedFeatures.machine_type}
                      onValueChange={(value) => setAdvancedFeatures(prev => ({ ...prev, machine_type: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="machine_type">
                        <SelectValue placeholder="Select machine type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L">Low (L)</SelectItem>
                        <SelectItem value="M">Medium (M)</SelectItem>
                        <SelectItem value="H">High (H)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="air_temp">Air Temperature (K)</Label>
                    <Input
                      id="air_temp"
                      type="number"
                      step="0.1"
                      value={advancedFeatures.air_temperature_k}
                      onChange={(e) => setAdvancedFeatures(prev => ({ ...prev, air_temperature_k: parseFloat(e.target.value) || 0 }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="process_temp">Process Temperature (K)</Label>
                    <Input
                      id="process_temp"
                      type="number"
                      step="0.1"
                      value={advancedFeatures.process_temperature_k}
                      onChange={(e) => setAdvancedFeatures(prev => ({ ...prev, process_temperature_k: parseFloat(e.target.value) || 0 }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rpm">Rotational Speed (RPM)</Label>
                    <Input
                      id="rpm"
                      type="number"
                      value={advancedFeatures.rotational_speed_rpm}
                      onChange={(e) => setAdvancedFeatures(prev => ({ ...prev, rotational_speed_rpm: parseFloat(e.target.value) || 0 }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="torque">Torque (Nm)</Label>
                    <Input
                      id="torque"
                      type="number"
                      step="0.1"
                      value={advancedFeatures.torque_nm}
                      onChange={(e) => setAdvancedFeatures(prev => ({ ...prev, torque_nm: parseFloat(e.target.value) || 0 }))}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tool_wear">Tool Wear (min)</Label>
                    <Input
                      id="tool_wear"
                      type="number"
                      value={advancedFeatures.tool_wear_min}
                      onChange={(e) => setAdvancedFeatures(prev => ({ ...prev, tool_wear_min: parseInt(e.target.value) || 0 }))}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSubmitAdvancedValues}
                    disabled={isSubmitting}
                    className="btn-hover"
                  >
                    {isSubmitting ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Processing...</span>
                      </>
                    ) : (
                      "Predict Failure & Repair Cost"
                    )}
                  </Button>
                </div>

                {advancedResult && (
                  <div className="mt-6 p-4 border rounded-lg bg-muted/50 animate-slide-in">
                    <h3 className="text-lg font-semibold mb-4">Prediction Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Failure Type</p>
                        <p className="font-medium">{advancedResult.failure_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Severity</p>
                        <p className={`font-medium ${
                          advancedResult.severity === 'High' || advancedResult.severity === 'Critical' || advancedResult.severity === 'Severe' ? 'text-red-500' :
                          advancedResult.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {advancedResult.severity}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Days Until Maintenance</p>
                        <p className="font-medium">{advancedResult.days_until_maintenance} days</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Repair Cost</p>
                        <p className="font-medium">${advancedResult.estimated_repair_cost}</p>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-sm text-muted-foreground">Parts Needed</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {advancedResult.parts_needed && advancedResult.parts_needed.length > 0 ? (
                            advancedResult.parts_needed.map((part: string, idx: number) => (
                              <span key={idx} className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">
                                {part}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm font-medium">None</span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <p className="text-sm text-muted-foreground">Recommendations</p>
                        <p className="font-medium">{advancedResult.maintenance_recommendations}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
