"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useAuth } from "@/context/auth-context"
import {
  Settings,
  User,
  Server,
  Bell,
  Shield,
  Check,
  AlertCircle,
  Info,
  MessageSquare,
  Cpu,
  RefreshCw,
} from "lucide-react"

export default function SettingsPage() {
  const { user } = useAuth()
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:8000")
  const [apiKey, setApiKey] = useState("")
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [confidenceThreshold, setConfidenceThreshold] = useState([80])
  const [isTestingApi, setIsTestingApi] = useState(false)
  const [apiTestResult, setApiTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [chatbotApiKey, setChatbotApiKey] = useState("")
  const [chatbotModel, setChatbotModel] = useState("gpt-4")
  const [chatbotPrompt, setChatbotPrompt] = useState(
    "You are an AI assistant for a predictive maintenance system. Help users understand machine health, maintenance schedules, and troubleshooting steps.",
  )
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedApiEndpoint = localStorage.getItem("apiEndpoint")
    if (savedApiEndpoint) setApiEndpoint(savedApiEndpoint)

    const savedChatbotModel = localStorage.getItem("chatbotModel")
    if (savedChatbotModel) setChatbotModel(savedChatbotModel)

    const savedChatbotPrompt = localStorage.getItem("chatbotPrompt")
    if (savedChatbotPrompt) setChatbotPrompt(savedChatbotPrompt)

    const savedConfidenceThreshold = localStorage.getItem("confidenceThreshold")
    if (savedConfidenceThreshold) setConfidenceThreshold([Number.parseInt(savedConfidenceThreshold)])
  }, [])

  const testApiConnection = async () => {
    setIsTestingApi(true)
    setApiTestResult(null)

    try {
      // Simulate API connection test
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll consider the connection successful if the endpoint includes "localhost"
      if (apiEndpoint.includes("localhost")) {
        setApiTestResult({
          success: true,
          message: "Connection successful! API is responding correctly.",
        })
      } else {
        setApiTestResult({
          success: false,
          message: "Connection failed. Please check your API endpoint and try again.",
        })
      }
    } catch (error) {
      setApiTestResult({
        success: false,
        message: "An error occurred while testing the connection.",
      })
    } finally {
      setIsTestingApi(false)
    }
  }

  const testChatbotApi = async () => {
    setIsTestingApi(true)
    setApiTestResult(null)

    try {
      // Simulate API test
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, we'll consider the test successful if the API key is not empty
      if (chatbotApiKey.trim().length > 0) {
        setApiTestResult({
          success: true,
          message: "Chatbot API connection successful! Model is available.",
        })
      } else {
        setApiTestResult({
          success: false,
          message: "API key is required. Please enter a valid API key.",
        })
      }
    } catch (error) {
      setApiTestResult({
        success: false,
        message: "An error occurred while testing the chatbot API.",
      })
    } finally {
      setIsTestingApi(false)
    }
  }

  const saveSettings = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      // Simulate saving settings
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save settings to localStorage
      localStorage.setItem("apiEndpoint", apiEndpoint)
      localStorage.setItem("chatbotModel", chatbotModel)
      localStorage.setItem("chatbotPrompt", chatbotPrompt)
      localStorage.setItem("confidenceThreshold", confidenceThreshold[0].toString())

      setSaveSuccess(true)
    } catch (error) {
      console.error("Error saving settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Configure your predictive maintenance dashboard</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="chatbot" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chatbot
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="ml" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              ML Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general dashboard settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                  </div>
                  <p className="text-sm text-muted-foreground">Enable dark mode for the dashboard interface</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select defaultValue="mm-dd-yyyy">
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                      <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confidence-threshold">Confidence Threshold (%)</Label>
                    <span className="text-sm font-medium">{confidenceThreshold[0]}%</span>
                  </div>
                  <Slider
                    id="confidence-threshold"
                    min={50}
                    max={99}
                    step={1}
                    value={confidenceThreshold}
                    onValueChange={setConfidenceThreshold}
                  />
                  <p className="text-sm text-muted-foreground">Set the minimum confidence level for predictions</p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? <LoadingSpinner size="sm" /> : "Save Changes"}
                  </Button>
                </div>

                {saveSuccess && (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your settings have been saved successfully.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={user?.name || "John Doe"} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email || "john.doe@example.com"} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue={user?.role || "engineer"}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="engineer">Engineer</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? <LoadingSpinner size="sm" /> : "Update Account"}
                  </Button>
                </div>

                {saveSuccess && (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your account has been updated successfully.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure the connection to your Python backend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">API Endpoint</Label>
                  <Input
                    id="api-endpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="http://localhost:8000"
                  />
                  <p className="text-sm text-muted-foreground">The base URL of your Python backend API</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="••••••••••••••••••••••••••"
                  />
                  <p className="text-sm text-muted-foreground">Authentication key for API requests</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Select defaultValue="30">
                    <SelectTrigger id="timeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 seconds</SelectItem>
                      <SelectItem value="30">30 seconds</SelectItem>
                      <SelectItem value="60">60 seconds</SelectItem>
                      <SelectItem value="120">120 seconds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {apiTestResult && (
                  <Alert
                    className={
                      apiTestResult.success
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }
                  >
                    {apiTestResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{apiTestResult.success ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>{apiTestResult.message}</AlertDescription>
                  </Alert>
                )}

                <div className="rounded-md bg-muted p-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">API Security</h4>
                      <p className="text-xs text-muted-foreground">
                        Ensure your API endpoint uses HTTPS in production environments. Local development can use HTTP
                        for testing purposes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={testApiConnection}
                    disabled={isTestingApi || !apiEndpoint}
                    className="flex items-center gap-2"
                  >
                    {isTestingApi ? <LoadingSpinner size="sm" /> : <RefreshCw className="h-4 w-4" />}
                    Test Connection
                  </Button>
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? <LoadingSpinner size="sm" /> : "Save Configuration"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chatbot" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Configuration</CardTitle>
                <CardDescription>Configure the AI assistant for your predictive maintenance system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="chatbot-api-key">LLM API Key</Label>
                  <Input
                    id="chatbot-api-key"
                    type="password"
                    value={chatbotApiKey}
                    onChange={(e) => setChatbotApiKey(e.target.value)}
                    placeholder="sk-••••••••••••••••••••••••••"
                  />
                  <p className="text-sm text-muted-foreground">Your API key for the language model service</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chatbot-model">Language Model</Label>
                  <Select value={chatbotModel} onValueChange={setChatbotModel}>
                    <SelectTrigger id="chatbot-model">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="llama-3-70b">Llama 3 70B</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chatbot-prompt">System Prompt</Label>
                  <Textarea
                    id="chatbot-prompt"
                    value={chatbotPrompt}
                    onChange={(e) => setChatbotPrompt(e.target.value)}
                    placeholder="Enter system prompt for the AI assistant"
                    className="min-h-32"
                  />
                  <p className="text-sm text-muted-foreground">
                    Define the behavior and knowledge of the AI assistant with a system prompt
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chatbot-memory">Enable Conversation Memory</Label>
                    <Switch id="chatbot-memory" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow the chatbot to remember previous conversations for context
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chatbot-data-access">Access to Machine Data</Label>
                    <Switch id="chatbot-data-access" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow the chatbot to access and reference machine data and maintenance records
                  </p>
                </div>

                {apiTestResult && (
                  <Alert
                    className={
                      apiTestResult.success
                        ? "bg-green-50 border-green-200 text-green-800"
                        : "bg-red-50 border-red-200 text-red-800"
                    }
                  >
                    {apiTestResult.success ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <AlertTitle>{apiTestResult.success ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>{apiTestResult.message}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={testChatbotApi}
                    disabled={isTestingApi || !chatbotApiKey}
                    className="flex items-center gap-2"
                  >
                    {isTestingApi ? <LoadingSpinner size="sm" /> : <RefreshCw className="h-4 w-4" />}
                    Test API
                  </Button>
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? <LoadingSpinner size="sm" /> : "Save Configuration"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you receive alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-notifications">Enable Notifications</Label>
                    <Switch id="enable-notifications" checked={notifications} onCheckedChange={setNotifications} />
                  </div>
                  <p className="text-sm text-muted-foreground">Receive notifications for important events</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Notification Types</h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maintenance-alerts">Maintenance Alerts</Label>
                      <Switch id="maintenance-alerts" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">Alerts when an asset requires maintenance</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="prediction-updates">Prediction Updates</Label>
                      <Switch id="prediction-updates" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">Updates when RUL predictions change significantly</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="system-notifications">System Notifications</Label>
                      <Switch id="system-notifications" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">Notifications about system updates and changes</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="anomaly-alerts">Anomaly Alerts</Label>
                      <Switch id="anomaly-alerts" defaultChecked />
                    </div>
                    <p className="text-sm text-muted-foreground">Alerts when anomalies are detected in sensor data</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-method">Notification Method</Label>
                  <Select defaultValue="both">
                    <SelectTrigger id="notification-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Only</SelectItem>
                      <SelectItem value="dashboard">Dashboard Only</SelectItem>
                      <SelectItem value="both">Email & Dashboard</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="all">All Methods</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notification-frequency">Alert Frequency</Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger id="notification-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly Digest</SelectItem>
                      <SelectItem value="daily">Daily Digest</SelectItem>
                      <SelectItem value="weekly">Weekly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? <LoadingSpinner size="sm" /> : "Save Preferences"}
                  </Button>
                </div>

                {saveSuccess && (
                  <Alert className="bg-green-50 border-green-200 text-green-800">
                    <Check className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your notification preferences have been saved.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ml" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Machine Learning Settings</CardTitle>
                <CardDescription>Configure parameters for the predictive maintenance models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="model-version">Active Model Version</Label>
                  <Select defaultValue="v2.3.0">
                    <SelectTrigger id="model-version">
                      <SelectValue placeholder="Select model version" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v2.3.0">RUL Prediction v2.3.0 (Latest)</SelectItem>
                      <SelectItem value="v2.2.0">RUL Prediction v2.2.0</SelectItem>
                      <SelectItem value="v2.1.0">RUL Prediction v2.1.0</SelectItem>
                      <SelectItem value="v1.5.0">Anomaly Detection v1.5.0 (Latest)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prediction-interval">Prediction Interval (hours)</Label>
                    <span className="text-sm font-medium">24</span>
                  </div>
                  <Slider id="prediction-interval" min={1} max={168} step={1} defaultValue={[24]} />
                  <p className="text-sm text-muted-foreground">How often the system should generate new predictions</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="anomaly-sensitivity">Anomaly Detection Sensitivity</Label>
                    <span className="text-sm font-medium">Medium</span>
                  </div>
                  <Select defaultValue="medium">
                    <SelectTrigger id="anomaly-sensitivity">
                      <SelectValue placeholder="Select sensitivity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Fewer alerts, may miss anomalies)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (More alerts, may have false positives)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-retrain">Automatic Model Retraining</Label>
                    <Switch id="auto-retrain" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically retrain models when new data is available
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retrain-frequency">Retraining Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="retrain-frequency">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Model Performance</AlertTitle>
                  <AlertDescription>
                    Changing these settings may affect model performance and prediction accuracy. It's recommended to
                    test changes in a non-production environment first.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end">
                  <Button onClick={saveSettings} disabled={isSaving}>
                    {isSaving ? <LoadingSpinner size="sm" /> : "Save Settings"}
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

