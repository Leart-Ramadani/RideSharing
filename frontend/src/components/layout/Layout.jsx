import { useState } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export const navigationItems = [
    { label: 'Dashboard', path: '/dashboard', section: 'Overview' },

    { label: 'Users', path: '/users', section: 'Identity' },
    { label: 'Roles', path: '/roles', section: 'Identity' },
    { label: 'User Roles', path: '/user-roles', section: 'Identity' },

    { label: 'Drivers', path: '/drivers', section: 'Management' },
    { label: 'Vehicles', path: '/vehicles', section: 'Management' },
    { label: 'Passengers', path: '/passengers', section: 'Management' },

    { label: 'Rides', path: '/rides', section: 'Operations' },
    { label: 'Ride Requests', path: '/ride-requests', section: 'Operations' },
    { label: 'Locations', path: '/locations', section: 'Operations' },

    { label: 'Fares', path: '/fares', section: 'Finance' },
    { label: 'Payments', path: '/payments', section: 'Finance' },
    { label: 'Ratings', path: '/ratings', section: 'Finance' },
    { label: 'Promo Codes', path: '/promo-codes', section: 'Finance' },
    { label: 'Driver Payouts', path: '/driver-payouts', section: 'Finance' },
]

const pageDetails = {
    '/dashboard': { title: 'Dashboard', subtitle: 'Overview of daily operations.' },
    '/users': { title: 'Users', subtitle: 'Manage system user accounts.' },
    '/roles': { title: 'Roles', subtitle: 'Manage roles and permissions.' },
    '/user-roles': { title: 'User Roles', subtitle: 'Assign roles to users.' },
    '/drivers': { title: 'Drivers', subtitle: 'Manage driver profiles and documents.' },
    '/vehicles': { title: 'Vehicles', subtitle: 'Manage the vehicle fleet.' },
    '/passengers': { title: 'Passengers', subtitle: 'Manage passenger accounts.' },
    '/rides': { title: 'Rides', subtitle: 'View and manage trips.' },
    '/ride-requests': { title: 'Ride Requests', subtitle: 'Manage incoming ride requests.' },
    '/locations': { title: 'Locations', subtitle: 'Manage saved locations and zones.' },
    '/fares': { title: 'Fares', subtitle: 'Configure fare rates and pricing.' },
    '/payments': { title: 'Payments', subtitle: 'Track payments and transactions.' },
    '/ratings': { title: 'Ratings', subtitle: 'View driver and passenger ratings.' },
    '/promo-codes': { title: 'Promo Codes', subtitle: 'Manage discount and promo codes.' },
    '/driver-payouts': { title: 'Driver Payouts', subtitle: 'Manage driver payout periods.' },
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
                className={`min-h-screen transition-[margin] duration-300 ease-in-out ${collapsed ? 'lg:ml-[92px]' : 'lg:ml-[280px]'
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
