import { useState } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const navigationItems = [
    { label: 'Dashboard',      path: '/passenger/dashboard',     section: 'Overview' },
    { label: 'Request a Ride', path: '/passenger/request',       section: 'Operations' },
    { label: 'My Rides',       path: '/passenger/rides',         section: 'Operations' },
    { label: 'My Requests',    path: '/passenger/ride-requests', section: 'Operations' },
    { label: 'My Wallet',      path: '/passenger/wallet',        section: 'Finance' },
    { label: 'My Profile',     path: '/passenger/profile',       section: 'Account' },
]

const pageDetails = {
    '/passenger/dashboard':     { title: 'Dashboard',      subtitle: 'Your passenger overview.' },
    '/passenger/request':       { title: 'Request a Ride', subtitle: 'Book a new ride.' },
    '/passenger/rides':         { title: 'My Rides',       subtitle: 'View your ride history.' },
    '/passenger/ride-requests': { title: 'My Requests',    subtitle: 'View your pending and past requests.' },
    '/passenger/wallet':        { title: 'My Wallet',      subtitle: 'Manage your wallet and transactions.' },
    '/passenger/profile':       { title: 'My Profile',     subtitle: 'Update your personal information.' },
}

function PassengerLayout({ colorMode, onToggleColorMode }) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const currentPage = pageDetails[location.pathname] ?? pageDetails['/passenger/dashboard']

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
                panelTitle="Passenger Panel"
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

export default PassengerLayout
