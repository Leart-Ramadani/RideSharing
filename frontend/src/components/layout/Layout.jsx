import { useState } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', section: 'Overview' },
  { label: 'Drivers', path: '/drivers', section: 'Management' },
  { label: 'Vehicles', path: '/vehicles', section: 'Management' },
  { label: 'Passengers', path: '/passengers', section: 'Management' },
  { label: 'Rides', path: '/rides', section: 'Operations' },
  { label: 'Payments', path: '/payments', section: 'Finance' },
]

const pageDetails = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Track daily operations, booking volume, and rider demand.',
  },
  '/drivers': {
    title: 'Drivers',
    subtitle: 'Manage onboarding, verification, and active driver performance.',
  },
  '/vehicles': {
    title: 'Vehicles',
    subtitle: 'Review fleet status, assignments, and maintenance readiness.',
  },
  '/passengers': {
    title: 'Passengers',
    subtitle: 'Monitor rider activity, profiles, and support-related flags.',
  },
  '/rides': {
    title: 'Rides',
    subtitle: 'View trip activity, scheduling health, and dispatch flow.',
  },
  '/payments': {
    title: 'Payments',
    subtitle: 'Track settlements, payout status, and recent transaction summaries.',
  },
}

function AdminLayout({ colorMode, onToggleColorMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const currentPage = pageDetails[location.pathname] ?? pageDetails['/dashboard']

  const handleDrawerToggle = () => {
    setMobileOpen((currentValue) => !currentValue)
  }

  const handleSidebarToggle = () => {
    setCollapsed((currentValue) => !currentValue)
  }

  const handleMobileClose = () => {
    setMobileOpen(false)
  }

  return (
    <Box className="min-h-screen bg-transparent">
      <Navbar
        collapsed={collapsed}
        colorMode={colorMode}
        onDrawerToggle={handleDrawerToggle}
        onToggleColorMode={onToggleColorMode}
        pageSubtitle={currentPage.subtitle}
        pageTitle={currentPage.title}
      />

      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        navigationItems={navigationItems}
        onCloseMobile={handleMobileClose}
        onToggleCollapse={handleSidebarToggle}
      />

      <Box
        component="main"
        className={`min-h-screen transition-[margin] duration-300 ease-in-out ${
          collapsed ? 'lg:ml-[92px]' : 'lg:ml-[280px]'
        }`}
      >
        <Toolbar />
        <Box className="px-4 pb-6 pt-4 sm:px-6 lg:px-8">
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
