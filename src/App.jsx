import { lazy, Suspense, Component, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AppSettingsProvider } from './context/AppSettingsContext'
import LoadingScreen from './components/LoadingScreen'
import PageSkeleton from './components/PageSkeleton'
import BottomNav from './components/BottomNav'
import InstallBanner from './components/InstallBanner'
import { NotificationProvider } from './context/NotificationContext'
import { AchievementsProvider } from './context/AchievementsContext'
import OfflineBar from './components/OfflineBar'
import PageTransition from './components/PageTransition'
import { useT } from './i18n'

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
const DietitianDetailPage  = lazy(() => import('./pages/DietitianDetailPage'))
const RecipesPage          = lazy(() => import('./pages/RecipesPage'))
const SubscriptionPage     = lazy(() => import('./pages/SubscriptionPage'))
const ProFeaturesPage      = lazy(() => import('./pages/ProFeaturesPage'))
const MenstrualCyclePage   = lazy(() => import('./pages/MenstrualCyclePage'))
const BadgesPage           = lazy(() => import('./pages/BadgesPage'))
const CheckinPage          = lazy(() => import('./pages/CheckinPage'))
const MealPlannerPage      = lazy(() => import('./pages/MealPlannerPage'))
const ExportDataPage       = lazy(() => import('./pages/ExportDataPage'))
const HealthSyncPage       = lazy(() => import('./pages/HealthSyncPage'))
const QuizPage             = lazy(() => import('./pages/QuizPage'))

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#DC2626', marginBottom: '1rem' }}>Si è verificato un errore imprevisto.</p>
          <button onClick={() => this.setState({ error: null })} style={{ padding: '0.5rem 1.5rem', borderRadius: '8px', border: 'none', background: '#1a7f5a', color: '#fff', cursor: 'pointer' }}>
            Riprova
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    // Also reset any scrollable .page element (mobile PWA inner scroll)
    const page = document.querySelector('.page')
    if (page) page.scrollTop = 0
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  return (
    <Routes>
        <Route path="/login" element={<PublicRoute><PageTransition><LoginPage /></PageTransition></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><PageTransition><RegisterPage /></PageTransition></PublicRoute>} />
        <Route path="/dietitian/chat" element={<PrivateRoute><PageTransition><DietitianChatPage /></PageTransition></PrivateRoute>} />
        <Route path="/dietitian/profilo" element={<DietitianRoute><PageTransition><DietitianProfilePage /></PageTransition></DietitianRoute>} />
        <Route path="/" element={<PatientRoute><PageTransition><DashboardPage /></PageTransition></PatientRoute>} />
        <Route path="/dieta" element={<PatientRoute><PageTransition><DietPage /></PageTransition></PatientRoute>} />
        <Route path="/macro" element={<PatientRoute><PageTransition><MacroTrackerPage /></PageTransition></PatientRoute>} />
        <Route path="/acqua" element={<PatientRoute><PageTransition><WaterPage /></PageTransition></PatientRoute>} />
        <Route path="/alimenti" element={<PatientRoute><PageTransition><FoodDatabasePage /></PageTransition></PatientRoute>} />
        <Route path="/ricette" element={<PatientRoute><PageTransition><RecipesPage /></PageTransition></PatientRoute>} />
        <Route path="/chat" element={<PatientRoute><PageTransition><ChatPage /></PageTransition></PatientRoute>} />
        <Route path="/documenti" element={<PatientRoute><PageTransition><DocumentsPage /></PageTransition></PatientRoute>} />
        <Route path="/progressi" element={<PatientRoute><PageTransition><ProgressPage /></PageTransition></PatientRoute>} />
        <Route path="/attivita" element={<PatientRoute><PageTransition><ActivityPage /></PageTransition></PatientRoute>} />
        <Route path="/statistiche" element={<PatientRoute><PageTransition><StatisticsPage /></PageTransition></PatientRoute>} />
        <Route path="/benessere" element={<PatientRoute><PageTransition><WellnessPage /></PageTransition></PatientRoute>} />
        <Route path="/dietisti" element={<PatientRoute><PageTransition><DietitianProfilesPage /></PageTransition></PatientRoute>} />
        <Route path="/dietisti/:dietitianId" element={<PatientRoute><PageTransition><DietitianDetailPage /></PageTransition></PatientRoute>} />
        <Route path="/profilo" element={<PatientRoute><PageTransition><ProfilePage /></PageTransition></PatientRoute>} />
        <Route path="/abbonamento" element={<PatientRoute><PageTransition><SubscriptionPage /></PageTransition></PatientRoute>} />
        <Route path="/pro" element={<PatientRoute><PageTransition><ProFeaturesPage /></PageTransition></PatientRoute>} />
        <Route path="/ciclo" element={<PatientRoute><PageTransition><MenstrualCyclePage /></PageTransition></PatientRoute>} />
        <Route path="/badge" element={<PatientRoute><PageTransition><BadgesPage /></PageTransition></PatientRoute>} />
        <Route path="/checkin" element={<PatientRoute><PageTransition><CheckinPage /></PageTransition></PatientRoute>} />
        <Route path="/meal-planner" element={<PatientRoute><PageTransition><MealPlannerPage /></PageTransition></PatientRoute>} />
        <Route path="/esporta-dati" element={<PatientRoute><PageTransition><ExportDataPage /></PageTransition></PatientRoute>} />
        <Route path="/salute" element={<PatientRoute><PageTransition><HealthSyncPage /></PageTransition></PatientRoute>} />
        <Route path="/quiz" element={<PatientRoute><PageTransition><QuizPage /></PageTransition></PatientRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  )
}

function AppInner() {
  const { user, isDietitian, refreshProfile } = useAuth()
  const t = useT()

  async function handleReconnect() {
    if (user) await refreshProfile()
  }

  return (
    <NotificationProvider user={user}>
    <AchievementsProvider>
      <ScrollToTop />
      <OfflineBar onReconnect={handleReconnect} />
      <InstallBanner />
      {user && !isDietitian && <BottomNav />}
      <div className={user && !isDietitian ? 'app-content' : 'app-content-public'}>
        <ErrorBoundary>
          <Suspense fallback={<PageSkeleton />}>
            <AnimatedRoutes />
          </Suspense>
        </ErrorBoundary>
        <footer className="global-copyright-app">
          {t('app.copyright', { year: new Date().getFullYear() })}
        </footer>
      </div>
    </AchievementsProvider>
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
