"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  Search,
  Plus,
  Gauge,
  CheckCircle,
  AlertTriangle,
  Wrench,
  BarChart3,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { getMachines } from "@/utils/api"
import type { Machine } from "@/types"

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([])
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState("grid")

  useEffect(() => {
    const fetchMachines = async () => {
      setIsLoading(true)
      try {
        const data = await getMachines()
        setMachines(data)
        setFilteredMachines(data)
      } catch (error) {
        console.error("Error fetching machines:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMachines()
  }, [])

  useEffect(() => {
    // Filter machines based on search term and status filter
    let filtered = machines

    if (searchTerm) {
      filtered = filtered.filter(
        (machine) =>
          machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          machine.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((machine) => machine.status === statusFilter)
    }

    // Sort machines
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "health":
          return b.healthScore - a.healthScore
        case "status":
          return a.status.localeCompare(b.status)
        case "location":
          return a.location.localeCompare(b.location)
        default:
          return 0
      }
    })

    setFilteredMachines(filtered)
  }, [machines, searchTerm, statusFilter, sortBy])

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

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "operational":
        return <div className="status-indicator status-operational" />
      case "warning":
        return <div className="status-indicator status-warning" />
      case "critical":
        return <div className="status-indicator status-critical" />
      case "maintenance":
        return <div className="status-indicator status-maintenance" />
      default:
        return <div className="status-indicator bg-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <LoadingSpinner size="lg" text="Loading machines..." />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Machines</h1>
            <p className="text-muted-foreground">Monitor and manage your equipment</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Machine
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search machines..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="health">Health Score</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="location">Location</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-md border">
            <Button
              variant={view === "grid" ? "default" : "ghost"}
              size="icon"
              className="rounded-none rounded-l-md"
              onClick={() => setView("grid")}
            >
              <Gauge className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="icon"
              className="rounded-none rounded-r-md"
              onClick={() => setView("list")}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredMachines.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-3 mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No machines found</h3>
              <p className="text-muted-foreground mb-4">
                No machines match your search criteria. Try adjusting your filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : view === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMachines.map((machine) => (
              <Link key={machine.id} href={`/machines/${machine.id}`} className="block">
                <Card className="overflow-hidden transition-all hover:shadow-md h-full">
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
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Installed:</span>
                            <p className="font-medium">{machine.installDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Next Maint:</span>
                            <p className="font-medium">{machine.nextMaintenance}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 gap-2 p-4 font-medium border-b">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Health</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Next Maintenance</div>
                </div>
                <div className="divide-y">
                  {filteredMachines.map((machine) => (
                    <Link key={machine.id} href={`/machines/${machine.id}`}>
                      <div className="grid grid-cols-12 gap-2 p-4 hover:bg-muted/50 transition-colors">
                        <div className="col-span-4 flex items-center">
                          <div className="mr-2">{getStatusIndicator(machine.status)}</div>
                          <div>
                            <div className="font-medium">{machine.name}</div>
                            <div className="text-sm text-muted-foreground">{machine.type}</div>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center">{getStatusBadge(machine.status)}</div>
                        <div className="col-span-2 flex items-center">
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-1">
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
                        </div>
                        <div className="col-span-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{machine.location}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{machine.nextMaintenance}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

