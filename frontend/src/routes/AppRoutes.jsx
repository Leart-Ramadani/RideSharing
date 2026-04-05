import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from '../components/layout/Layout'
import DashboardPage from '../pages/DashboardPage'
import DriversPage from '../pages/DriversPage'
import PassengersPage from '../pages/PassengersPage'
import PaymentsPage from '../pages/PaymentsPage'
import RidesPage from '../pages/RidesPage'
import VehiclesPage from '../pages/VehiclesPage'

function AppRoutes({ colorMode, onToggleColorMode }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<AdminLayout colorMode={colorMode} onToggleColorMode={onToggleColorMode} />}
        >
          <Route index element={<Navigate replace to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="passengers" element={<PassengersPage />} />
          <Route path="rides" element={<RidesPage />} />
          <Route path="payments" element={<PaymentsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
