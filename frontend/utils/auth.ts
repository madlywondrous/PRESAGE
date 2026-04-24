import type { User } from "@/types"

// Mock users for demo purposes
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Engineer User",
    email: "engineer@example.com",
    password: "engineer123",
    role: "engineer",
  },
  {
    id: "3",
    name: "Technician User",
    email: "tech@example.com",
    password: "tech123",
    role: "technician",
  },
  {
    id: "4",
    name: "Viewer User",
    email: "viewer@example.com",
    password: "viewer123",
    role: "viewer",
  },
]

// Login function
export const login = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Remove password before returning user
  const { password: _, ...userWithoutPassword } = user

  // Store user in localStorage
  localStorage.setItem("user", JSON.stringify(userWithoutPassword))

  return userWithoutPassword as User
}

// Logout function
export const logout = async (): Promise<void> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Remove user from localStorage
  localStorage.removeItem("user")
}

// Check if user is logged in
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") {
    return null
  }

  const userJson = localStorage.getItem("user")
  if (!userJson) {
    return null
  }

  try {
    return JSON.parse(userJson) as User
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}

// Register function (for demo purposes)
export const register = async (name: string, email: string, password: string, role: string): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check if user already exists
  if (MOCK_USERS.some((u) => u.email === email)) {
    throw new Error("User with this email already exists")
  }

  // Create new user
  const newUser = {
    id: `${MOCK_USERS.length + 1}`,
    name,
    email,
    password,
    role,
  }

  // In a real app, we would save this to a database
  MOCK_USERS.push(newUser)

  // Remove password before returning user
  const { password: _, ...userWithoutPassword } = newUser

  // Store user in localStorage
  localStorage.setItem("user", JSON.stringify(userWithoutPassword))

  return userWithoutPassword as User
}

// Check if user has required role
export const hasRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false
  return roles.includes(user.role)
}

