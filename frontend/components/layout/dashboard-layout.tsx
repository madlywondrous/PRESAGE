"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  FileInput,
  Timer,
  LineChart,
  Settings,
  Menu,
  X,
  Database,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  ChevronUp,
  LogOut,
  User,
  Moon,
  Sun,
  BrainCircuit,
  Bell,
  Gauge,
  Wrench,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { useTheme } from "next-themes"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Machine Monitoring",
    href: "/machines",
    icon: Gauge,
  },
  {
    title: "Historical Data",
    href: "/historical-data",
    icon: Database,
  },
  {
    title: "Data Input",
    href: "/data-input",
    icon: FileInput,
  },
  {
    title: "RUL Analysis",
    href: "/rul-analysis",
    icon: Timer,
  },
  {
    title: "Visualizations",
    href: "/visualizations",
    icon: LineChart,
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
  },
  {
    title: "ML Models",
    href: "/ml-models",
    icon: BrainCircuit,
  },
  {
    title: "Alerts",
    href: "/alerts",
    icon: Bell,
  },
  {
    title: "Energy Insights",
    href: "/energy",
    icon: Zap,
  },
  {
    title: "Implementation Guide",
    href: "/implementation-guide",
    icon: BookOpen,
  },
  {
    title: "Chat Assistant",
    href: "/chat",
    icon: MessageCircle,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)

    // Retrieve sidebar state from localStorage
    const savedSidebarState = localStorage.getItem("sidebarOpen")
    if (savedSidebarState !== null) {
      setIsSidebarOpen(savedSidebarState === "true")
    }
  }, [])

  // Add this effect to save sidebar state
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("sidebarOpen", String(isSidebarOpen))
    }
  }, [isSidebarOpen, isMounted])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  // Check if user is authenticated
  useEffect(() => {
    if (isMounted && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [isMounted, user, pathname, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!isMounted) {
    return null
  }

  // If not authenticated and not on login page, don't render anything
  if (!user && pathname !== "/login") {
    return null
  }

  // If on login page, just render children
  if (pathname === "/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSidebarOpen ? "open" : "closed"}
          initial={{ width: isSidebarOpen ? 0 : 64 }}
          animate={{ width: isSidebarOpen ? 240 : 64 }}
          exit={{ width: isSidebarOpen ? 0 : 64 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-y-0 left-0 z-40 bg-gray-950 border-r border-gray-800 overflow-hidden hidden md:block"
        >
          {/* User profile at top */}
          <div className="flex items-center px-4 py-4 border-b border-gray-800">
            {isSidebarOpen ? (
              <div className="flex items-center w-full">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarFallback className="bg-gray-800 text-white">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-800 text-white">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          <nav className="space-y-1 px-2 py-4 overflow-y-auto h-[calc(100vh-64px-40px)]">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 hover:bg-gray-800",
                  pathname === item.href ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white",
                  !isSidebarOpen && "justify-center px-0",
                )}
              >
                <item.icon className={cn("h-5 w-5", isSidebarOpen && "mr-3")} />
                {isSidebarOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>

          {/* Theme toggle and sidebar collapse at bottom */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-800 p-2 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-gray-400 hover:text-white">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-400 hover:text-white"
            >
              {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile bottom sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            className="mobile-sidebar-container"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="mobile-sidebar-content bg-gray-950">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-gray-800 text-white">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.role}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200",
                      pathname === item.href
                        ? "bg-gray-800 text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800",
                    )}
                  >
                    <item.icon className="h-6 w-6 mb-1" />
                    <span className="text-xs text-center">{item.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="rounded-full shadow-lg h-12 w-12 btn-hover bg-gray-900 hover:bg-gray-800"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isSidebarOpen ? "md:ml-60" : "md:ml-16",
        )}
      >
        <main className="flex-1 overflow-auto p-4 pt-6 md:p-6 md:pt-6 lg:p-8 lg:pt-8 animate-fade-in">{children}</main>
      </div>
    </div>
  )
}

