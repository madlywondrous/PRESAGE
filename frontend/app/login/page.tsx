"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
      setIsLoading(false)
    }
  }

  const handleDeveloperLogin = async () => {
    setIsLoading(true)
    try {
      await login("admin@example.com", "admin123")
      router.push("/")
    } catch (err) {
      setError("Developer login failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        <Card className="overflow-hidden border-0 shadow-2xl">
          <div className="grid md:grid-cols-2">
            {/* Left side - Login form */}
            <CardContent className="p-8 md:p-12">
              <div className="mb-8 flex items-center">
                <div className="mr-2 h-8 w-8 rounded-full bg-black">
                  <Image
                    src="/placeholder.svg?height=32&width=32"
                    alt="Logo"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
                <h1 className="text-xl font-bold">PredictMaint</h1>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                <p className="text-muted-foreground">Sign in to your account to continue</p>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" className="h-auto p-0 text-xs">
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12"
                  />
                </div>

                <Button type="submit" className="h-12 w-full" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size="sm" /> : "Sign in"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button variant="link" className="h-auto p-0">
                  Sign up
                </Button>
              </div>

              <div className="mt-12 border-t pt-4">
                <Button variant="outline" className="w-full justify-between" onClick={handleDeveloperLogin}>
                  <span>Developer Access</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>

            {/* Right side - Image/Illustration */}
            <div className="hidden bg-black md:block">
              <div className="flex h-full flex-col items-center justify-center p-8 text-white">
                <div className="mb-8 text-center">
                  <h2 className="mb-2 text-2xl font-bold">PRESAGE Platform</h2>
                  <p className="text-gray-400">
                    Advanced analytics and machine learning for equipment health monitoring
                  </p>
                </div>
                <div className="relative h-64 w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-48 w-48 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-xl"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 w-16 rounded-lg bg-gray-800 p-4">
                        <div className="h-full w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-600"></div>
                      </div>
                      <div className="h-16 w-16 rounded-lg bg-gray-800 p-4">
                        <div className="h-full w-full rounded-md bg-gradient-to-r from-purple-500 to-purple-600"></div>
                      </div>
                      <div className="h-16 w-16 rounded-lg bg-gray-800 p-4">
                        <div className="h-full w-full rounded-md bg-gradient-to-r from-green-500 to-green-600"></div>
                      </div>
                      <div className="h-16 w-16 rounded-lg bg-gray-800 p-4">
                        <div className="h-full w-full rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 text-center text-sm text-gray-400">
                  Powered by advanced machine learning algorithms
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

