"use client"

import type React from "react"

import { useState } from "react"
import { FileType, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { uploadCsvData } from "@/utils/api"

interface FileUploadProps {
  onUploadComplete: () => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setIsUploading(true)
      await uploadCsvData(file)
      setFile(null)
      setIsUploading(false)
      onUploadComplete()
    } catch (error) {
      console.error("Error uploading file:", error)
      setIsUploading(false)
      alert("Error uploading file. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload CSV File</CardTitle>
        <CardDescription>Upload a CSV file containing sensor data for analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
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
              disabled={isUploading}
            />
          </label>
        </div>

        {file && (
          <div className="p-4 mt-4 rounded-lg bg-muted">
            <div className="flex items-center">
              <FileType className="w-5 h-5 mr-2 text-muted-foreground" />
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
            {isUploading ? "Uploading..." : "Upload Data"}
            {!isUploading && <Upload className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

