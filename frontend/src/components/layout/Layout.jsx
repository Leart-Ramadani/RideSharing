import { useState } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

export const navigationItems = [
    { label: 'Dashboard', path: '/admin/dashboard', section: 'Overview' },

    { label: 'Users', path: '/admin/users', section: 'Identity' },
    // { label: 'Roles', path: '/admin/roles', section: 'Identity' },
    { label: 'User Roles', path: '/admin/user-roles', section: 'Identity' },

    { label: 'Drivers', path: '/admin/drivers', section: 'Management' },
    { label: 'Vehicles', path: '/admin/vehicles', section: 'Management' },
    { label: 'Passengers', path: '/admin/passengers', section: 'Management' },

    { label: 'Rides', path: '/admin/rides', section: 'Operations' },
    { label: 'Ride Requests', path: '/admin/ride-requests', section: 'Operations' },

    { label: 'Fares', path: '/admin/fares', section: 'Finance' },
    { label: 'Payments', path: '/admin/payments', section: 'Finance' },
    { label: 'Ratings', path: '/admin/ratings', section: 'Finance' },
    { label: 'Promo Codes', path: '/admin/promo-codes', section: 'Finance' },
    { label: 'Driver Payouts', path: '/admin/driver-payouts', section: 'Finance' },

    { label: 'My Profile', path: '/admin/profile', section: 'Account' },
]

const pageDetails = {
    '/admin/dashboard':      { title: 'Dashboard',      subtitle: 'Overview of daily operations.' },
    '/admin/users':          { title: 'Users',           subtitle: 'Manage system user accounts.' },
    '/admin/roles':          { title: 'Roles',           subtitle: 'Manage roles and permissions.' },
    '/admin/user-roles':     { title: 'User Roles',      subtitle: 'Assign roles to users.' },
    '/admin/drivers':        { title: 'Drivers',         subtitle: 'Manage driver profiles and documents.' },
    '/admin/vehicles':       { title: 'Vehicles',        subtitle: 'Manage the vehicle fleet.' },
    '/admin/passengers':     { title: 'Passengers',      subtitle: 'Manage passenger accounts.' },
    '/admin/rides':          { title: 'Rides',           subtitle: 'View and manage trips.' },
    '/admin/ride-requests':  { title: 'Ride Requests',   subtitle: 'Manage incoming ride requests.' },
    '/admin/fares':          { title: 'Fares',           subtitle: 'Configure fare rates and pricing.' },
    '/admin/payments':       { title: 'Payments',        subtitle: 'Track payments and transactions.' },
    '/admin/ratings':        { title: 'Ratings',         subtitle: 'View driver and passenger ratings.' },
    '/admin/promo-codes':    { title: 'Promo Codes',     subtitle: 'Manage discount and promo codes.' },
    '/admin/driver-payouts': { title: 'Driver Payouts',  subtitle: 'Manage driver payout periods.' },
    '/admin/profile':        { title: 'My Profile',      subtitle: 'Update your personal information.' },
}

function AdminLayout({ colorMode, onToggleColorMode }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const currentPage = pageDetails[location.pathname] ?? pageDetails['/admin/dashboard']

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
