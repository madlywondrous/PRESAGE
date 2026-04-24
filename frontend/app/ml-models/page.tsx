"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  BrainCircuit,
  GitBranch,
  GitCommit,
  GitMerge,
  Clock,
  BarChart,
  CheckCircle,
  Info,
  Network,
  Lightbulb,
  Zap,
  Bell,
  RefreshCw,
  Wifi,
  LineChart,
} from "lucide-react"

// Model type definitions
interface ModelVersion {
  version: string
  date: string
  accuracy: number
  status: "production" | "testing" | "deprecated"
  description: string
  features: string[]
  commit: string
}

interface ModelType {
  id: string
  name: string
  type: "supervised" | "unsupervised" | "reinforcement" | "future"
  description: string
  versions: ModelVersion[]
  currentVersion: string
}

// Mock data for models
const models: ModelType[] = [
  {
    id: "rul-prediction",
    name: "RUL Prediction Model",
    type: "supervised",
    description: "Predicts the Remaining Useful Life of machinery based on sensor data",
    currentVersion: "v2.3.0",
    versions: [
      {
        version: "v2.3.0",
        date: "2023-11-15",
        accuracy: 94.3,
        status: "production",
        description: "Improved accuracy with additional sensor data integration",
        features: ["Sensor fusion", "Time series analysis", "Confidence intervals"],
        commit: "8a7b9c2d",
      },
      {
        version: "v2.2.0",
        date: "2023-08-22",
        accuracy: 92.1,
        status: "deprecated",
        description: "Added support for new sensor types",
        features: ["Multi-sensor support", "Enhanced feature extraction"],
        commit: "5e6f7a8b",
      },
      {
        version: "v2.1.0",
        date: "2023-05-10",
        accuracy: 91.5,
        status: "deprecated",
        description: "Performance optimizations and bug fixes",
        features: ["Optimized inference", "Improved error handling"],
        commit: "2c3d4e5f",
      },
    ],
  },
  {
    id: "anomaly-detection",
    name: "Anomaly Detection System",
    type: "unsupervised",
    description: "Identifies unusual patterns in sensor data that may indicate equipment issues",
    currentVersion: "v1.5.0",
    versions: [
      {
        version: "v1.5.0",
        date: "2023-12-05",
        accuracy: 89.7,
        status: "production",
        description: "Implemented isolation forest algorithm for better outlier detection",
        features: ["Isolation forest", "Dynamic thresholding", "Real-time detection"],
        commit: "9c8b7a6d",
      },
      {
        version: "v1.4.0",
        date: "2023-09-18",
        accuracy: 86.2,
        status: "deprecated",
        description: "Added support for multivariate anomaly detection",
        features: ["Multivariate analysis", "Correlation detection"],
        commit: "5d4e3f2a",
      },
    ],
  },
  {
    id: "maintenance-classifier",
    name: "Maintenance Need Classifier",
    type: "supervised",
    description: "Classifies whether equipment requires maintenance based on operational parameters",
    currentVersion: "v3.1.0",
    versions: [
      {
        version: "v3.1.0",
        date: "2023-10-30",
        accuracy: 95.8,
        status: "production",
        description: "Improved classification with ensemble methods",
        features: ["Random forest ensemble", "Gradient boosting", "Feature importance analysis"],
        commit: "7e6d5c4b",
      },
      {
        version: "v3.0.0",
        date: "2023-07-12",
        accuracy: 93.4,
        status: "deprecated",
        description: "Major architecture update with deep learning integration",
        features: ["Neural network integration", "Transfer learning"],
        commit: "3b2a1c0d",
      },
    ],
  },
  {
    id: "component-clustering",
    name: "Component Degradation Clustering",
    type: "unsupervised",
    description: "Groups similar degradation patterns to identify common failure modes",
    currentVersion: "v1.2.0",
    versions: [
      {
        version: "v1.2.0",
        date: "2023-11-08",
        accuracy: 87.5,
        status: "production",
        description: "Implemented DBSCAN for density-based clustering",
        features: ["DBSCAN algorithm", "Noise filtering", "Cluster visualization"],
        commit: "4d5e6f7g",
      },
      {
        version: "v1.1.0",
        date: "2023-06-25",
        accuracy: 84.9,
        status: "deprecated",
        description: "Added hierarchical clustering capabilities",
        features: ["Hierarchical clustering", "Dendrogram visualization"],
        commit: "1a2b3c4d",
      },
    ],
  },
  {
    id: "energy-optimization",
    name: "Energy Consumption Optimizer",
    type: "reinforcement",
    description: "Optimizes machine operations to reduce energy consumption while maintaining performance",
    currentVersion: "v1.0.0",
    versions: [
      {
        version: "v1.0.0",
        date: "2023-12-15",
        accuracy: 82.3,
        status: "testing",
        description: "Initial release with Q-learning implementation",
        features: ["Q-learning algorithm", "State-action mapping", "Reward optimization"],
        commit: "0e9f8d7c",
      },
    ],
  },
]

// Future models data
const futureModels = [
  {
    id: "root-cause-analysis",
    name: "Root Cause Analysis (RCA)",
    description: "Explain why a failure might occur using causal inference and explainable AI techniques",
    features: ["Causal inference", "Explainable AI", "Fault tree analysis", "Bayesian networks"],
    timeline: "Q2 2024",
    icon: Lightbulb,
  },
  {
    id: "alert-system",
    name: "Automated Alert System",
    description: "Notify technicians in case of critical warnings with intelligent alert routing and prioritization",
    features: ["Alert prioritization", "Notification routing", "Escalation workflows", "Mobile alerts"],
    timeline: "Q3 2024",
    icon: Bell,
  },
  {
    id: "adaptive-learning",
    name: "Adaptive Learning System",
    description: "Model that improves over time with more data using continuous learning techniques",
    features: ["Online learning", "Incremental model updates", "Drift detection", "Performance monitoring"],
    timeline: "Q4 2024",
    icon: RefreshCw,
  },
  {
    id: "iot-integration",
    name: "IoT Integration Framework",
    description: "Directly pull sensor data from industrial machines with secure and reliable connectivity",
    features: ["Secure IoT protocols", "Edge computing", "Data buffering", "Device management"],
    timeline: "Q1 2025",
    icon: Wifi,
  },
  {
    id: "energy-efficiency",
    name: "Energy Efficiency Insights",
    description: "Monitor energy consumption and suggest optimizations to reduce costs and environmental impact",
    features: ["Energy profiling", "Consumption analytics", "Optimization recommendations", "ROI calculations"],
    timeline: "Q2 2025",
    icon: Zap,
  },
]

export default function MLModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "production":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" /> Production
          </Badge>
        )
      case "testing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Info className="mr-1 h-3 w-3" /> Testing
          </Badge>
        )
      case "deprecated":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Clock className="mr-1 h-3 w-3" /> Deprecated
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getModelTypeIcon = (type: string) => {
    switch (type) {
      case "supervised":
        return <BarChart className="h-5 w-5 text-blue-500" />
      case "unsupervised":
        return <Network className="h-5 w-5 text-purple-500" />
      case "reinforcement":
        return <RefreshCw className="h-5 w-5 text-green-500" />
      case "future":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
      default:
        return <BrainCircuit className="h-5 w-5" />
    }
  }

  const getModelTypeBadge = (type: string) => {
    switch (type) {
      case "supervised":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Supervised Learning
          </Badge>
        )
      case "unsupervised":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Unsupervised Learning
          </Badge>
        )
      case "reinforcement":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Reinforcement Learning
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">ML Models</h1>
          <p className="text-muted-foreground">
            Overview of machine learning models and their versions used in the predictive maintenance system
          </p>
        </div>

        <Tabs defaultValue="models" className="space-y-4">
          <TabsList>
            <TabsTrigger value="models" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              Current Models
            </TabsTrigger>
            <TabsTrigger value="versions" className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Version History
            </TabsTrigger>
            <TabsTrigger value="future" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Future Roadmap
            </TabsTrigger>
          </TabsList>

          <TabsContent value="models" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {models.map((model) => (
                <Card key={model.id} className="overflow-hidden transition-all hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getModelTypeIcon(model.type)}
                        <CardTitle className="ml-2 text-lg">{model.name}</CardTitle>
                      </div>
                      {getModelTypeBadge(model.type)}
                    </div>
                    <CardDescription className="mt-2">{model.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <GitCommit className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Current Version:</span>
                        </div>
                        <Badge variant="outline" className="bg-black text-white">
                          {model.currentVersion}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Accuracy</span>
                          <span className="text-sm font-medium">
                            {model.versions.find((v) => v.version === model.currentVersion)?.accuracy}%
                          </span>
                        </div>
                        <Progress
                          value={model.versions.find((v) => v.version === model.currentVersion)?.accuracy}
                          className="h-2"
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" size="sm" className="text-xs" onClick={() => setSelectedModel(model)}>
                          View Details
                        </Button>
                        <div>
                          {getStatusBadge(model.versions.find((v) => v.version === model.currentVersion)?.status || "")}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedModel && (
              <Card className="animate-slide-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getModelTypeIcon(selectedModel.type)}
                      <CardTitle className="ml-2">{selectedModel.name}</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedModel(null)}>
                      Close
                    </Button>
                  </div>
                  <CardDescription>{selectedModel.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Current Version Details</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Version</span>
                          <Badge variant="outline" className="bg-black text-white">
                            {selectedModel.currentVersion}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status</span>
                          {getStatusBadge(
                            selectedModel.versions.find((v) => v.version === selectedModel.currentVersion)?.status ||
                              "",
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Release Date</span>
                          <span>
                            {selectedModel.versions.find((v) => v.version === selectedModel.currentVersion)?.date}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Accuracy</span>
                          <span className="font-medium">
                            {selectedModel.versions.find((v) => v.version === selectedModel.currentVersion)?.accuracy}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Commit</span>
                          <code className="bg-muted px-1 py-0.5 rounded text-sm">
                            {selectedModel.versions.find((v) => v.version === selectedModel.currentVersion)?.commit}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Features</h3>
                      <ul className="space-y-2">
                        {selectedModel.versions
                          .find((v) => v.version === selectedModel.currentVersion)
                          ?.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span>{feature}</span>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Performance Metrics</h3>
                    <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                      <LineChart className="h-8 w-8 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Performance chart would be displayed here</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="versions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Version History</CardTitle>
                <CardDescription>
                  Track the evolution of machine learning models and their performance improvements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {models.map((model) => (
                    <div key={model.id} className="space-y-4">
                      <div className="flex items-center">
                        {getModelTypeIcon(model.type)}
                        <h3 className="text-lg font-medium ml-2">{model.name}</h3>
                        {getModelTypeBadge(model.type)}
                      </div>

                      <div className="relative pl-6 border-l border-gray-200 dark:border-gray-800 space-y-6">
                        {model.versions.map((version, index) => (
                          <div key={version.version} className="relative">
                            <div className="absolute -left-[25px] p-1 bg-background border border-gray-200 dark:border-gray-800 rounded-full">
                              {index === 0 ? (
                                <GitMerge className="h-4 w-4 text-green-500" />
                              ) : (
                                <GitCommit className="h-4 w-4 text-gray-500" />
                              )}
                            </div>
                            <div className="bg-muted/50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <Badge variant="outline" className="bg-black text-white mr-2">
                                    {version.version}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">{version.date}</span>
                                </div>
                                {getStatusBadge(version.status)}
                              </div>
                              <p className="text-sm mb-3">{version.description}</p>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Accuracy</span>
                                <span className="text-sm font-medium">{version.accuracy}%</span>
                              </div>
                              <Progress value={version.accuracy} className="h-2 mb-3" />
                              <div className="flex flex-wrap gap-2">
                                {version.features.map((feature, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                              <div className="mt-3 text-xs text-muted-foreground">
                                Commit: <code className="bg-muted px-1 py-0.5 rounded">{version.commit}</code>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="future" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Future Model Roadmap</CardTitle>
                <CardDescription>Upcoming machine learning models and features planned for development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {futureModels.map((model) => (
                    <div
                      key={model.id}
                      className="rounded-lg border p-4 transition-all hover:shadow-md hover:bg-accent/50"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="mt-0.5 rounded-full bg-yellow-100 p-2 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                          <model.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{model.name}</h4>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {model.timeline}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{model.description}</p>
                          <div className="mt-3">
                            <h5 className="text-sm font-medium mb-2">Planned Features:</h5>
                            <div className="flex flex-wrap gap-2">
                              {model.features.map((feature, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Alert className="mt-6 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-200">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Development Roadmap</AlertTitle>
                  <AlertDescription>
                    This roadmap is subject to change based on business priorities and technological advancements.
                    Feedback and feature requests are welcome to help us prioritize development efforts.
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

