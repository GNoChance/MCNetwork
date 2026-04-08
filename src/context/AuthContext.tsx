import { createContext, useContext, useState, type ReactNode } from 'react'

export type UserRole = 'admin' | 'user'

export type User = {
  username: string
  role: UserRole
  uuid?: string
}

const ADMIN_USER: User = {
  username: 'Link',
  role: 'admin',
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  loginAsAdmin: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (u: User) => setUser(u)
  const loginAsAdmin = () => setUser(ADMIN_USER)
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}