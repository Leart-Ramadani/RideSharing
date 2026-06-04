import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminLayout from '../components/layout/Layout'
import DriverLayout from '../components/layout/DriverLayout'
import PassengerLayout from '../components/layout/PassengerLayout'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProfilePage from '../pages/ProfilePage'

// Admin pages
import DashboardPage from '../pages/DashboardPage'
import RolesPage from '../pages/RolesPage'
import UserRolesPage from '../pages/UserRolesPage'
import UsersPage from '../pages/UsersPage'
import DriversPage from '../pages/DriversPage'
import PassengersPage from '../pages/PassengersPage'
import VehiclesPage from '../pages/VehiclesPage'
import RideRequestsPage from '../pages/RideRequestsPage'
import RidesPage from '../pages/RidesPage'
import DriverPayoutsPage from '../pages/DriverPayoutsPage'
import FaresPage from '../pages/FaresPage'
import PaymentsPage from '../pages/PaymentsPage'
import PromoCodesPage from '../pages/PromoCodesPage'
import RatingsPage from '../pages/RatingsPage'

// Driver pages
import DriverDashboardPage from '../pages/DriverDashboardPage'
import DriverPendingRequestsPage from '../pages/DriverPendingRequestsPage'
import DriverMyRidesPage from '../pages/DriverMyRidesPage'
import DriverMyVehiclePage from '../pages/DriverMyVehiclePage'

// Passenger pages
import PassengerDashboardPage from '../pages/PassengerDashboardPage'
import PassengerRequestRidePage from '../pages/PassengerRequestRidePage'
import PassengerMyRidesPage from '../pages/PassengerMyRidesPage'
import PassengerMyRequestsPage from '../pages/PassengerMyRequestsPage'
import PassengerWalletPage from '../pages/PassengerWalletPage'

function LoadingScreen() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  )
}

function getHomeForRole(user) {
  if (!user) return '/login'
  const roles = user.roles?.map((r) => r.normalized_name) ?? []
  if (roles.includes('ADMIN'))     return '/admin/dashboard'
  if (roles.includes('DRIVER'))    return '/driver/dashboard'
  if (roles.includes('PASSENGER')) return '/passenger/dashboard'
  return '/login'
}

function RequireRole({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" replace />
  const roles = user.roles?.map((r) => r.normalized_name) ?? []
  if (!roles.includes(role)) return <Navigate to={getHomeForRole(user)} replace />
  return children
}

function GuestOnly({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return user ? <Navigate to={getHomeForRole(user)} replace /> : children
}

function RoleRedirect() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return <Navigate to={getHomeForRole(user)} replace />
}

function AppRoutes({ colorMode, onToggleColorMode }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage colorMode={colorMode} onToggleColorMode={onToggleColorMode} />} />
        <Route path="/login"    element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
        <Route path="/dashboard" element={<RoleRedirect />} />

        {/* ── Admin ─────────────────────────────────────────── */}
        <Route
          path="/admin"
          element={
            <RequireRole role="ADMIN">
              <AdminLayout colorMode={colorMode} onToggleColorMode={onToggleColorMode} />
            </RequireRole>
          }
        >
          <Route index element={<Navigate replace to="/admin/dashboard" />} />
          <Route path="dashboard"      element={<DashboardPage />} />
          <Route path="users"          element={<UsersPage />} />
          <Route path="roles"          element={<RolesPage />} />
          <Route path="user-roles"     element={<UserRolesPage />} />
          <Route path="drivers"        element={<DriversPage />} />
          <Route path="vehicles"       element={<VehiclesPage />} />
          <Route path="passengers"     element={<PassengersPage />} />
          <Route path="rides"          element={<RidesPage />} />
          <Route path="ride-requests"  element={<RideRequestsPage />} />
          <Route path="fares"          element={<FaresPage />} />
          <Route path="payments"       element={<PaymentsPage />} />
          <Route path="ratings"        element={<RatingsPage />} />
          <Route path="promo-codes"    element={<PromoCodesPage />} />
          <Route path="driver-payouts" element={<DriverPayoutsPage />} />
          <Route path="profile"        element={<ProfilePage />} />
        </Route>

        {/* ── Driver ─────────────────────────────────────────── */}
        <Route
          path="/driver"
          element={
            <RequireRole role="DRIVER">
              <DriverLayout colorMode={colorMode} onToggleColorMode={onToggleColorMode} />
            </RequireRole>
          }
        >
          <Route index element={<Navigate replace to="/driver/dashboard" />} />
          <Route path="dashboard" element={<DriverDashboardPage />} />
          <Route path="requests"  element={<DriverPendingRequestsPage />} />
          <Route path="rides"     element={<DriverMyRidesPage />} />
          <Route path="vehicle"   element={<DriverMyVehiclePage />} />
          <Route path="profile"   element={<ProfilePage />} />
        </Route>

        {/* ── Passenger ──────────────────────────────────────── */}
        <Route
          path="/passenger"
          element={
            <RequireRole role="PASSENGER">
              <PassengerLayout colorMode={colorMode} onToggleColorMode={onToggleColorMode} />
            </RequireRole>
          }
        >
          <Route index element={<Navigate replace to="/passenger/dashboard" />} />
          <Route path="dashboard"     element={<PassengerDashboardPage />} />
          <Route path="request"       element={<PassengerRequestRidePage />} />
          <Route path="rides"         element={<PassengerMyRidesPage />} />
          <Route path="ride-requests" element={<PassengerMyRequestsPage />} />
          <Route path="wallet"        element={<PassengerWalletPage />} />
          <Route path="profile"       element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<RoleRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
