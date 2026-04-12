import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import DietPage from './pages/DietPage'
import MacroTrackerPage from './pages/MacroTrackerPage'
import WaterPage from './pages/WaterPage'
import FoodDatabasePage from './pages/FoodDatabasePage'
import ProfilePage from './pages/ProfilePage'
import ChatPage from './pages/ChatPage'
import DocumentsPage from './pages/DocumentsPage'
import ProgressPage from './pages/ProgressPage'
import StatisticsPage from './pages/StatisticsPage'
import WellnessPage from './pages/WellnessPage'
import BottomNav from './components/BottomNav'
import LoadingScreen from './components/LoadingScreen'
import InstallBanner from './components/InstallBanner'
import { NotificationProvider } from './context/NotificationContext'
import OfflineBar from './components/OfflineBar'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) return <Navigate to="/" replace />
  return children
}

function AppInner() {
  const { user, refreshProfile } = useAuth()

  // When connectivity is restored, refresh profile and let pages react to auth state
  async function handleReconnect() {
    if (user) await refreshProfile()
  }

  return (
    <NotificationProvider user={user}>
      <OfflineBar onReconnect={handleReconnect} />
      <InstallBanner />
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/dieta" element={<PrivateRoute><DietPage /></PrivateRoute>} />
        <Route path="/macro" element={<PrivateRoute><MacroTrackerPage /></PrivateRoute>} />
        <Route path="/acqua" element={<PrivateRoute><WaterPage /></PrivateRoute>} />
        <Route path="/alimenti" element={<PrivateRoute><FoodDatabasePage /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
        <Route path="/documenti" element={<PrivateRoute><DocumentsPage /></PrivateRoute>} />
        <Route path="/progressi" element={<PrivateRoute><ProgressPage /></PrivateRoute>} />
        <Route path="/statistiche" element={<PrivateRoute><StatisticsPage /></PrivateRoute>} />
        <Route path="/benessere" element={<PrivateRoute><WellnessPage /></PrivateRoute>} />
        <Route path="/profilo" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {user && <BottomNav />}
    </NotificationProvider>
  )
}

export default function App() {
  return (
    <AppSettingsProvider>
      <AppInner />
    </AppSettingsProvider>
  )
}
