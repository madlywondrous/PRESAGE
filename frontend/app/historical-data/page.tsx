"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { fetchHistoricalData } from "@/utils/api"
import { Search, Download, Filter, Upload, RefreshCw } from "lucide-react"

export default function HistoricalDataPage() {
  const [data, setData] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const rowsPerPage = 10

  useEffect(() => {
    // Load historical data from API
    const loadData = async () => {
      try {
        setIsLoading(true)
        const historicalData = await fetchHistoricalData(500) // Get more data
        setData(historicalData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading historical data:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Memoize filtered data
  const filteredData = useMemo(() => {
    if (searchTerm.trim() === "") return data;
    const lowerSearch = searchTerm.toLowerCase();
    return data.filter((item) =>
      Object.values(item).some(
        (value) => value !== null && value.toString().toLowerCase().includes(lowerSearch),
      )
    );
  }, [data, searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calculate pagination
  const { totalPages, startIndex, paginatedData } = useMemo(() => {
    const total = Math.ceil(filteredData.length / rowsPerPage) || 1;
    const start = (currentPage - 1) * rowsPerPage;
    const paginated = filteredData.slice(start, start + rowsPerPage);
    return { totalPages: total, startIndex: start, paginatedData: paginated };
  }, [filteredData, currentPage]);

  // Handle CSV export
  const exportToCSV = () => {
    const headers = Object.keys(data[0] || {}).join(",")
    const csvRows = data.map((row) =>
      Object.values(row)
        .map((value) => (typeof value === "string" ? `"${value}"` : value))
        .join(","),
    )

    const csvContent = [headers, ...csvRows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "machinery_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      // Simulate file upload to API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Reload data after successful upload
      const historicalData = await fetchHistoricalData(500)
      setData(historicalData)
      setFile(null)
      setIsUploading(false)

      // Show success message
      alert("Data uploaded successfully!")
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsUploading(false)
      alert("Error uploading file. Please try again.")
    }
  }

  const refreshData = async () => {
    try {
      setIsLoading(true)
      const historicalData = await fetchHistoricalData(500)
      setData(historicalData)
      setIsLoading(false)
    } catch (error) {
      console.error("Error refreshing data:", error)
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Historical Data</h1>
          <p className="text-muted-foreground">View and analyze historical machinery data</p>
        </div>

        <Tabs defaultValue="view" className="space-y-4">
          <TabsList>
            <TabsTrigger value="view" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              View Data
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Import Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="view" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle>Machinery Data</CardTitle>
                    <CardDescription>Historical sensor readings and maintenance records</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={refreshData}
                      className="flex items-center gap-2"
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportToCSV}
                      className="flex items-center gap-2"
                      disabled={isLoading || data.length === 0}
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search data..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Operational Hours</TableHead>
                          <TableHead>Sensor 1</TableHead>
                          <TableHead>Sensor 2</TableHead>
                          <TableHead>Sensor 3</TableHead>
                          <TableHead>RUL</TableHead>
                          <TableHead>Maintenance Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              <LoadingSpinner text="Loading data..." />
                            </TableCell>
                          </TableRow>
                        ) : paginatedData.length > 0 ? (
                          paginatedData.map((row, index) => (
                            <TableRow key={row.id || index} className="transition-colors hover:bg-muted/50">
                              <TableCell>{row.id || index + 1}</TableCell>
                              <TableCell>
                                {typeof row.operational_hours === "number"
                                  ? row.operational_hours.toFixed(0)
                                  : row.operational_hours}
                              </TableCell>
                              <TableCell>
                                {typeof row.sensor_1 === "number" ? row.sensor_1.toFixed(2) : row.sensor_1}
                              </TableCell>
                              <TableCell>
                                {typeof row.sensor_2 === "number" ? row.sensor_2.toFixed(2) : row.sensor_2}
                              </TableCell>
                              <TableCell>
                                {typeof row.sensor_3 === "number" ? row.sensor_3.toFixed(2) : row.sensor_3}
                              </TableCell>
                              <TableCell>{typeof row.RUL === "number" ? row.RUL.toFixed(2) : row.RUL}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    row.maintenance === 1
                                      ? "bg-red-50 text-red-700 border-red-200"
                                      : "bg-green-50 text-green-700 border-green-200"
                                  }
                                >
                                  {row.maintenance_status || (row.maintenance === 1 ? "Needs Maintenance" : "Normal")}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center">
                              No data found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + rowsPerPage, filteredData.length)} of{" "}
                        {filteredData.length} entries
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="btn-hover"
                        >
                          Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum = i + 1
                            if (totalPages > 5 && currentPage > 3) {
                              pageNum = currentPage - 3 + i
                              if (pageNum > totalPages) pageNum = totalPages - (4 - i)
                            }
                            return (
                              <Button
                                key={i}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="icon"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 btn-hover"
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="btn-hover"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Statistics</CardTitle>
                <CardDescription>Summary statistics of the historical data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border p-4 transition-all hover:bg-accent/50">
                    <div className="text-sm font-medium text-muted-foreground">Total Records</div>
                    <div className="mt-2 text-2xl font-bold">{data.length}</div>
                  </div>
                  <div className="rounded-lg border p-4 transition-all hover:bg-accent/50">
                    <div className="text-sm font-medium text-muted-foreground">Avg. RUL</div>
                    <div className="mt-2 text-2xl font-bold">
                      {data.length > 0
                        ? (
                            data.reduce((sum, item) => sum + (typeof item.RUL === "number" ? item.RUL : 0), 0) /
                            data.length
                          ).toFixed(2)
                        : "N/A"}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 transition-all hover:bg-accent/50">
                    <div className="text-sm font-medium text-muted-foreground">Maintenance Required</div>
                    <div className="mt-2 text-2xl font-bold">
                      {data.filter((item) => item.maintenance === 1).length}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 transition-all hover:bg-accent/50">
                    <div className="text-sm font-medium text-muted-foreground">Normal Operation</div>
                    <div className="mt-2 text-2xl font-bold">
                      {data.filter((item) => item.maintenance === 0).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
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
                      <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
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
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {file && (
                  <div className="p-4 mt-4 rounded-lg bg-muted animate-slide-in">
                    <div className="flex items-center">
                      <Upload className="w-5 h-5 mr-2 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setFile(null)} disabled={isUploading}>
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleUpload} disabled={!file || isUploading} className="flex items-center gap-2">
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Upload Data
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
