import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import LoadingScreen from './components/LoadingScreen'
import BottomNav from './components/BottomNav'
import InstallBanner from './components/InstallBanner'
import { NotificationProvider } from './context/NotificationContext'
import OfflineBar from './components/OfflineBar'

const LoginPage            = lazy(() => import('./pages/LoginPage'))
const RegisterPage         = lazy(() => import('./pages/RegisterPage'))
const DashboardPage        = lazy(() => import('./pages/DashboardPage'))
const DietPage             = lazy(() => import('./pages/DietPage'))
const MacroTrackerPage     = lazy(() => import('./pages/MacroTrackerPage'))
const WaterPage            = lazy(() => import('./pages/WaterPage'))
const FoodDatabasePage     = lazy(() => import('./pages/FoodDatabasePage'))
const ProfilePage          = lazy(() => import('./pages/ProfilePage'))
const ChatPage             = lazy(() => import('./pages/ChatPage'))
const DocumentsPage        = lazy(() => import('./pages/DocumentsPage'))
const ProgressPage         = lazy(() => import('./pages/ProgressPage'))
const ActivityPage         = lazy(() => import('./pages/ActivityPage'))
const StatisticsPage       = lazy(() => import('./pages/StatisticsPage'))
const WellnessPage         = lazy(() => import('./pages/WellnessPage'))
const DietitianChatPage    = lazy(() => import('./pages/DietitianChatPage'))
const DietitianProfilesPage = lazy(() => import('./pages/DietitianProfilesPage'))
const DietitianProfilePage = lazy(() => import('./pages/DietitianProfilePage'))
const RecipesPage          = lazy(() => import('./pages/RecipesPage'))

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

function PatientRoute({ children }) {
  const { user, loading, isDietitian } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (isDietitian) return <Navigate to="/dietitian/chat" replace />
  return children
}

function DietitianRoute({ children }) {
  const { user, loading, isDietitian } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  if (!isDietitian) return <Navigate to="/" replace />
  return children
}

function AppInner() {
  const { user, isDietitian, refreshProfile } = useAuth()

  // When connectivity is restored, refresh profile and let pages react to auth state
  async function handleReconnect() {
    if (user) await refreshProfile()
  }

  return (
    <NotificationProvider user={user}>
      <OfflineBar onReconnect={handleReconnect} />
      <InstallBanner />
      {user && !isDietitian && <BottomNav />}
      <div className={user && !isDietitian ? 'app-content' : 'app-content-public'}>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
            <Route path="/dietitian/chat" element={<PrivateRoute><DietitianChatPage /></PrivateRoute>} />
            <Route path="/dietitian/profilo" element={<DietitianRoute><DietitianProfilePage /></DietitianRoute>} />
            <Route path="/" element={<PatientRoute><DashboardPage /></PatientRoute>} />
            <Route path="/dieta" element={<PatientRoute><DietPage /></PatientRoute>} />
            <Route path="/macro" element={<PatientRoute><MacroTrackerPage /></PatientRoute>} />
            <Route path="/acqua" element={<PatientRoute><WaterPage /></PatientRoute>} />
            <Route path="/alimenti" element={<PatientRoute><FoodDatabasePage /></PatientRoute>} />
            <Route path="/ricette" element={<PatientRoute><RecipesPage /></PatientRoute>} />
            <Route path="/chat" element={<PatientRoute><ChatPage /></PatientRoute>} />
            <Route path="/documenti" element={<PatientRoute><DocumentsPage /></PatientRoute>} />
            <Route path="/progressi" element={<PatientRoute><ProgressPage /></PatientRoute>} />
            <Route path="/attivita" element={<PatientRoute><ActivityPage /></PatientRoute>} />
            <Route path="/statistiche" element={<PatientRoute><StatisticsPage /></PatientRoute>} />
            <Route path="/benessere" element={<PatientRoute><WellnessPage /></PatientRoute>} />
            <Route path="/dietisti" element={<PatientRoute><DietitianProfilesPage /></PatientRoute>} />
            <Route path="/profilo" element={<PatientRoute><ProfilePage /></PatientRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
        <footer className="global-copyright-app">
          © {new Date().getFullYear()} DietPlan Pro — Tutti i diritti riservati.
        </footer>
      </div>
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
