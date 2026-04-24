"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  ArrowRight,
  FileText,
  Timer,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Gauge,
  Wrench,
  Zap,
  BrainCircuit,
  TrendingUp,
  TrendingDown,
  Bell,
  Calendar,
} from "lucide-react"
import Link from "next/link"
import { getDashboardStats, getMachines, getMachineAlerts } from "@/utils/api"
import type { Machine, Alert as AlertType, DashboardStats } from "@/types"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [machines, setMachines] = useState<Machine[]>([])
  const [alerts, setAlerts] = useState<AlertType[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch all required data in parallel
        const [statsData, machinesData] = await Promise.all([getDashboardStats(), getMachines()])

        setStats(statsData)
        setMachines(machinesData)

        // Get alerts for all machines
        const alertsPromises = machinesData.map((machine) => getMachineAlerts(machine.id))
        const alertsData = await Promise.all(alertsPromises)

        // Flatten and sort alerts by timestamp (newest first)
        const allAlerts = alertsData
          .flat()
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5) // Get only the 5 most recent alerts

        setAlerts(allAlerts)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Operational
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertTriangle className="mr-1 h-3 w-3" /> Warning
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertTriangle className="mr-1 h-3 w-3" /> Critical
          </Badge>
        )
      case "maintenance":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Wrench className="mr-1 h-3 w-3" /> Maintenance
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAlertTypeBadge = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Warning
          </Badge>
        )
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Critical
          </Badge>
        )
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Info
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <LoadingSpinner size="lg" text="Loading dashboard data..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to PredictMaint</h1>
          <p className="text-muted-foreground">A comprehensive dashboard for your predictive maintenance model</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monitored Assets</CardTitle>
              <Gauge className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalMachines || 0}</div>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-green-400 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+3 this month</span>
                </div>
                <div className="ml-auto flex gap-1">
                  <Badge variant="outline" className="bg-green-900/50 text-green-400 border-green-800">
                    {stats?.healthyMachines || 0} Healthy
                  </Badge>
                  <Badge variant="outline" className="bg-red-900/50 text-red-400 border-red-800">
                    {stats?.criticalMachines || 0} Critical
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Health Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.averageHealthScore || 0}%</div>
              <Progress
                value={stats?.averageHealthScore || 0}
                className="h-2 mt-2 bg-gray-700"
                indicatorClassName={
                  (stats?.averageHealthScore || 0) > 80
                    ? "bg-green-500"
                    : (stats?.averageHealthScore || 0) > 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }
              />
              <div className="flex items-center mt-1">
                <div className="flex items-center text-yellow-400 text-xs">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span>-2.5% from last month</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Maintenance</CardTitle>
              <Wrench className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingMaintenances || 0}</div>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-blue-400 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Next: Tomorrow, 09:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              <Bell className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activeAlerts || 0}</div>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-red-400 text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>{stats?.criticalMachines || 0} critical issues</span>
                </div>
                <div className="ml-auto">
                  <Link href="/alerts">
                    <Button variant="link" size="sm" className="text-xs text-blue-400 p-0 h-auto">
                      View all
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="machines" className="space-y-4">
          <TabsList>
            <TabsTrigger value="machines" className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              Machines
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recent Alerts
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              System Overview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="machines" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {machines.map((machine) => (
                <Card key={machine.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{machine.name}</CardTitle>
                      {getStatusBadge(machine.status)}
                    </div>
                    <CardDescription>
                      {machine.type} - {machine.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Health Score</span>
                          <span
                            className={`text-sm font-medium ${
                              machine.healthScore > 80
                                ? "text-green-600"
                                : machine.healthScore > 60
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }`}
                          >
                            {machine.healthScore}%
                          </span>
                        </div>
                        <Progress
                          value={machine.healthScore}
                          className="h-2"
                          indicatorClassName={
                            machine.healthScore > 80
                              ? "bg-green-500"
                              : machine.healthScore > 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Last Maintenance:</span>
                          <p className="font-medium">{machine.lastMaintenance}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Maintenance:</span>
                          <p className="font-medium">{machine.nextMaintenance}</p>
                        </div>
                      </div>

                      <Link href={`/machines/${machine.id}`}>
                        <Button className="w-full" variant="outline">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/machines">
                <Button variant="outline" className="flex items-center gap-2">
                  View All Machines
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest alerts and notifications from your machines</CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length > 0 ? (
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-4 p-3 rounded-lg border">
                        <div
                          className={`mt-0.5 rounded-full p-1 ${
                            alert.type === "critical"
                              ? "bg-red-100 text-red-600"
                              : alert.type === "warning"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              {machines.find((m) => m.id === alert.machineId)?.name || "Unknown Machine"}
                            </p>
                            {getAlertTypeBadge(alert.type)}
                          </div>
                          <p className="text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(alert.timestamp)}</p>
                        </div>
                        <div>
                          {!alert.acknowledged && (
                            <Button variant="outline" size="sm">
                              Acknowledge
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <p className="text-lg font-medium">No active alerts</p>
                    <p className="text-muted-foreground">All systems are operating normally</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About This Project</CardTitle>
                <CardDescription>Learn how to use the predictive maintenance dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This dashboard provides a user-friendly interface to interact with your Python-based predictive
                  maintenance model. It allows you to input data, visualize results, and monitor the Remaining Useful
                  Life (RUL) of your assets.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Data Input</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload CSV files or generate random data to test the model
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <Timer className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">RUL Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        View detailed Remaining Useful Life predictions and maintenance indicators
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Visualizations</h4>
                      <p className="text-sm text-muted-foreground">
                        Explore model outputs through interactive charts and scatter plots
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">ML Models</h4>
                      <p className="text-sm text-muted-foreground">
                        View and manage machine learning models used for predictions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Energy Insights</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor energy consumption and optimize for efficiency
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Link href="/data-input">
                    <Button className="w-full sm:w-auto">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

