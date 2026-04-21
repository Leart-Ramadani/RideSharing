import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/layout/Layout'

import DashboardPage from '../pages/DashboardPage'

import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import RolesPage from '../pages/RolesPage'
import UserRolesPage from '../pages/UserRolesPage'
import UsersPage from '../pages/UsersPage'

import DriversPage from '../pages/DriversPage'
import PassengersPage from '../pages/PassengersPage'
import VehiclesPage from '../pages/VehiclesPage'

import LocationsPage from '../pages/LocationsPage'
import RideRequestsPage from '../pages/RideRequestsPage'
import RidesPage from '../pages/RidesPage'

import DriverPayoutsPage from '../pages/DriverPayoutsPage'
import FaresPage from '../pages/FaresPage'
import PaymentsPage from '../pages/PaymentsPage'
import PromoCodesPage from '../pages/PromoCodesPage'
import RatingsPage from '../pages/RatingsPage'

function AppRoutes({ colorMode, onToggleColorMode }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={<AdminLayout colorMode={colorMode} onToggleColorMode={onToggleColorMode} />}
        >
          <Route index element={<Navigate replace to="/dashboard" />} />

          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="user-roles" element={<UserRolesPage />} />

          <Route path="drivers" element={<DriversPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="passengers" element={<PassengersPage />} />

          <Route path="rides" element={<RidesPage />} />
          <Route path="ride-requests" element={<RideRequestsPage />} />
          <Route path="locations" element={<LocationsPage />} />

          <Route path="fares" element={<FaresPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="ratings" element={<RatingsPage />} />
          <Route path="promo-codes" element={<PromoCodesPage />} />
          <Route path="driver-payouts" element={<DriverPayoutsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
