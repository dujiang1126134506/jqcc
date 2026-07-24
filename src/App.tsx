import { useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Schedule from './pages/Schedule'
import Profile from './pages/Profile'
import { useGameStore } from './store'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const user = useGameStore((s) => s.user)

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  if (!user) return null
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <AuthGuard>
              <Home />
            </AuthGuard>
          }
        />
        <Route
          path="/schedule"
          element={
            <AuthGuard>
              <Schedule />
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          }
        />
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
  )
}
