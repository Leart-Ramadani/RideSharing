import { useState } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const navigationItems = [
    { label: 'Dashboard',         path: '/driver/dashboard', section: 'Overview' },
    { label: 'Pending Requests',  path: '/driver/requests',  section: 'Operations' },
    { label: 'My Rides',          path: '/driver/rides',     section: 'Operations' },
    { label: 'My Vehicle',        path: '/driver/vehicle',   section: 'Operations' },
    { label: 'My Profile',        path: '/driver/profile',   section: 'Account' },
]

const pageDetails = {
    '/driver/dashboard': { title: 'Dashboard',        subtitle: 'Your driver overview.' },
    '/driver/requests':  { title: 'Pending Requests', subtitle: 'Accept or reject incoming ride requests.' },
    '/driver/rides':     { title: 'My Rides',         subtitle: 'View and manage your assigned rides.' },
    '/driver/vehicle':   { title: 'My Vehicle',       subtitle: 'Your registered vehicle details.' },
    '/driver/profile':   { title: 'My Profile',       subtitle: 'Update your personal information.' },
}

function DriverLayout({ colorMode, onToggleColorMode }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const currentPage = pageDetails[location.pathname] ?? pageDetails['/driver/dashboard']

    return (
        <Box className="min-h-screen bg-transparent">
            <Navbar
                collapsed={collapsed}
                colorMode={colorMode}
                onDrawerToggle={() => setMobileOpen((v) => !v)}
                onToggleColorMode={onToggleColorMode}
                pageSubtitle={currentPage.subtitle}
                pageTitle={currentPage.title}
            />

            <Sidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                navigationItems={navigationItems}
                onCloseMobile={() => setMobileOpen(false)}
                onToggleCollapse={() => setCollapsed((v) => !v)}
                panelTitle="Driver Panel"
            />

            <Box
                component="main"
                className={`min-h-screen transition-[margin] duration-300 ease-in-out ${collapsed ? 'lg:ml-[92px]' : 'lg:ml-[280px]'}`}
            >
                <Toolbar />
                <Box className="px-4 pb-6 pt-4 sm:px-6 lg:px-8">
                    <Outlet />
                </Box>
            </Box>
        </Box>
    )
}

export default DriverLayout
