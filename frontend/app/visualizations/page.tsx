"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AlertCircle, BarChart3, LineChartIcon, ScatterChartIcon as ScatterPlot, RefreshCw } from "lucide-react"
import { fetchHistoricalData, getFeatureImportance } from "@/utils/api"

export default function VisualizationsPage() {
  const [timeRange, setTimeRange] = useState("all")
  const [inputFeatures, setInputFeatures] = useState<number[] | null>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  const [featureImportance, setFeatureImportance] = useState<any[]>([])
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

  // Load historical data and feature importance
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [historicalData, featureImportance] = await Promise.all([
          fetchHistoricalData(500), // Get more data
          getFeatureImportance(),
        ])

        setHistoricalData(historicalData)
        setFeatureImportance(featureImportance)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setIsLoading(false)
        alert("Error loading data. Please try again.")
      }
    }

    loadData()
  }, [])

  // Filter data based on time range
  const filteredData = useMemo(() => {
    return historicalData.filter((item) => {
      if (timeRange === "all") return true
      if (timeRange === "30d")
        return item.operational_hours >= (historicalData[historicalData.length - 1]?.operational_hours || 0) - 3000
      if (timeRange === "90d")
        return item.operational_hours >= (historicalData[historicalData.length - 1]?.operational_hours || 0) - 9000
      return true
    })
  }, [historicalData, timeRange])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [historicalData, featureImportance] = await Promise.all([fetchHistoricalData(500), getFeatureImportance()])

      setHistoricalData(historicalData)
      setFeatureImportance(featureImportance)
      setIsLoading(false)
    } catch (error) {
      console.error("Error refreshing data:", error)
      setIsLoading(false)
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Visualizations</h1>
          <p className="text-muted-foreground">Interactive charts and visualizations of model outputs</p>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={refreshData}
            className="flex items-center gap-2 btn-hover"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center p-12">
            <LoadingSpinner size="lg" text="Loading visualization data..." />
          </div>
        )}

        {!inputFeatures && !isLoading && (
          <Alert className="animate-slide-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No input data</AlertTitle>
            <AlertDescription>
              You can still view historical data visualizations, but for input-specific visualizations, please go to the
              Data Input page first.
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

        <Tabs defaultValue="timeseries" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="timeseries" className="flex items-center gap-2">
                <LineChartIcon className="h-4 w-4" />
                Time Series
              </TabsTrigger>
              <TabsTrigger value="scatter" className="flex items-center gap-2">
                <ScatterPlot className="h-4 w-4" />
                Scatter Plots
              </TabsTrigger>
              <TabsTrigger value="features" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Feature Importance
              </TabsTrigger>
            </TabsList>

            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <TabsContent value="timeseries" className="space-y-4">
            <Card className="chart-animate">
              <CardHeader>
                <CardTitle>RUL Trend Over Time</CardTitle>
                <CardDescription>Remaining Useful Life prediction trend over operational hours</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {filteredData.length > 0 ? (
                  <ChartContainer
                    config={{
                      rul: {
                        label: "RUL (hours)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="operational_hours"
                          label={{ value: "Operational Hours", position: "insideBottomRight", offset: -10 }}
                        />
                        <YAxis label={{ value: "RUL (hours)", angle: -90, position: "insideLeft" }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="RUL"
                          stroke="var(--color-rul)"
                          name="RUL (hours)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        {inputFeatures && (
                          <Line
                            type="monotone"
                            dataKey="input_rul"
                            stroke="#ff0000"
                            name="Your Input"
                            strokeWidth={0}
                            dot={{
                              cx: inputFeatures[3],
                              cy: 200,
                              r: 6,
                              fill: "#ff0000",
                            }}
                          />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex justify-center items-center h-[400px]">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="chart-animate">
              <CardHeader>
                <CardTitle>Sensor Readings Over Time</CardTitle>
                <CardDescription>Key sensor measurements tracked over operational hours</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {filteredData.length > 0 ? (
                  <ChartContainer
                    config={{
                      sensor_1: {
                        label: "Sensor 1",
                        color: "hsl(var(--chart-1))",
                      },
                      sensor_2: {
                        label: "Sensor 2",
                        color: "hsl(var(--chart-2))",
                      },
                      sensor_3: {
                        label: "Sensor 3",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="operational_hours"
                          label={{ value: "Operational Hours", position: "insideBottomRight", offset: -10 }}
                        />
                        <YAxis label={{ value: "Sensor Values", angle: -90, position: "insideLeft" }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="sensor_1"
                          stroke="var(--color-sensor_1)"
                          name="Sensor 1"
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sensor_2"
                          stroke="var(--color-sensor_2)"
                          name="Sensor 2"
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sensor_3"
                          stroke="var(--color-sensor_3)"
                          name="Sensor 3"
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        {inputFeatures && (
                          <>
                            <Line
                              type="monotone"
                              dataKey="input_s1"
                              stroke="#ff0000"
                              name="Your Input - S1"
                              strokeWidth={0}
                              dot={{
                                cx: inputFeatures[3],
                                cy: inputFeatures[0] * 50 + 200,
                                r: 6,
                                fill: "#ff0000",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="input_s2"
                              stroke="#00ff00"
                              name="Your Input - S2"
                              strokeWidth={0}
                              dot={{
                                cx: inputFeatures[3],
                                cy: inputFeatures[1] * 50 + 200,
                                r: 6,
                                fill: "#00ff00",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="input_s3"
                              stroke="#0000ff"
                              name="Your Input - S3"
                              strokeWidth={0}
                              dot={{
                                cx: inputFeatures[3],
                                cy: inputFeatures[2] * 50 + 200,
                                r: 6,
                                fill: "#0000ff",
                              }}
                            />
                          </>
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="flex justify-center items-center h-[400px]">
                    <p className="text-muted-foreground">No data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scatter" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="chart-animate">
                <CardHeader>
                  <CardTitle>Sensor 1 vs. RUL</CardTitle>
                  <CardDescription>Correlation between Sensor 1 readings and Remaining Useful Life</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredData.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            dataKey="sensor_1"
                            name="Sensor 1"
                            label={{ value: "Sensor 1", position: "insideBottomRight", offset: -10 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="RUL"
                            name="RUL"
                            unit=" hours"
                            label={{ value: "RUL (hours)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                          <Scatter name="Sensor 1 vs. RUL" data={filteredData} fill="#8884d8" />
                          {inputFeatures && (
                            <Scatter
                              name="Your Input"
                              data={[{ sensor_1: inputFeatures[0], RUL: 200 }]}
                              fill="#ff0000"
                            />
                          )}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[300px]">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="chart-animate">
                <CardHeader>
                  <CardTitle>Sensor 2 vs. RUL</CardTitle>
                  <CardDescription>Correlation between Sensor 2 readings and Remaining Useful Life</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredData.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            dataKey="sensor_2"
                            name="Sensor 2"
                            label={{ value: "Sensor 2", position: "insideBottomRight", offset: -10 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="RUL"
                            name="RUL"
                            unit=" hours"
                            label={{ value: "RUL (hours)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                          <Scatter name="Sensor 2 vs. RUL" data={filteredData} fill="#82ca9d" />
                          {inputFeatures && (
                            <Scatter
                              name="Your Input"
                              data={[{ sensor_2: inputFeatures[1], RUL: 200 }]}
                              fill="#ff0000"
                            />
                          )}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[300px]">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="chart-animate">
                <CardHeader>
                  <CardTitle>Sensor 3 vs. RUL</CardTitle>
                  <CardDescription>Correlation between Sensor 3 readings and Remaining Useful Life</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredData.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            dataKey="sensor_3"
                            name="Sensor 3"
                            label={{ value: "Sensor 3", position: "insideBottomRight", offset: -10 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="RUL"
                            name="RUL"
                            unit=" hours"
                            label={{ value: "RUL (hours)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                          <Scatter name="Sensor 3 vs. RUL" data={filteredData} fill="#ffc658" />
                          {inputFeatures && (
                            <Scatter
                              name="Your Input"
                              data={[{ sensor_3: inputFeatures[2], RUL: 200 }]}
                              fill="#ff0000"
                            />
                          )}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[300px]">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="chart-animate">
                <CardHeader>
                  <CardTitle>Operational Hours vs. RUL</CardTitle>
                  <CardDescription>Correlation between Operational Hours and Remaining Useful Life</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredData.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            dataKey="operational_hours"
                            name="Operational Hours"
                            label={{ value: "Operational Hours", position: "insideBottomRight", offset: -10 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="RUL"
                            name="RUL"
                            unit=" hours"
                            label={{ value: "RUL (hours)", angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                          <Scatter name="Operational Hours vs. RUL" data={filteredData} fill="#ff7300" />
                          {inputFeatures && (
                            <Scatter
                              name="Your Input"
                              data={[{ operational_hours: inputFeatures[3], RUL: 200 }]}
                              fill="#ff0000"
                            />
                          )}
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[300px]">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="chart-animate">
                <CardHeader>
                  <CardTitle>Feature Importance</CardTitle>
                  <CardDescription>Relative importance of features in the predictive model</CardDescription>
                </CardHeader>
                <CardContent>
                  {featureImportance.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          layout="vertical"
                          data={featureImportance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" name="Importance (%)" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[300px]">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="chart-animate">
                <CardHeader>
                  <CardTitle>Feature Distribution</CardTitle>
                  <CardDescription>Distribution of feature importance in the model</CardDescription>
                </CardHeader>
                <CardContent>
                  {featureImportance.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={featureImportance}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {featureImportance.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-[300px]">
                      <p className="text-muted-foreground">No data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="chart-animate">
              <CardHeader>
                <CardTitle>Maintenance Prediction Distribution</CardTitle>
                <CardDescription>Distribution of maintenance predictions in the historical data</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Normal", value: filteredData.filter((d) => d.maintenance === 0).length },
                            {
                              name: "Needs Maintenance",
                              value: filteredData.filter((d) => d.maintenance === 1).length,
                            },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#82ca9d" />
                          <Cell fill="#ff7300" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-[300px]">
                    <p className="text-muted-foreground">No data available</p>
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
