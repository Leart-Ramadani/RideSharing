import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import GroupRoundedIcon from '@mui/icons-material/GroupRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded'
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { NavLink } from 'react-router-dom'

const iconMap = {
  Dashboard: HomeRoundedIcon,
  Drivers: GroupsRoundedIcon,
  Vehicles: DirectionsCarRoundedIcon,
  Passengers: GroupRoundedIcon,
  Rides: DirectionsCarFilledRoundedIcon,
  Payments: AccountBalanceWalletRoundedIcon,
}

function Sidebar({ collapsed, mobileOpen, navigationItems, onCloseMobile, onToggleCollapse }) {
  const sidebarContent = (
    <div className="flex h-full flex-col bg-white/90 px-4 py-5 backdrop-blur-xl dark:bg-slate-950/90">
      <div className="flex items-center justify-between">
        {!collapsed && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-400">
              RideSharing
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">Admin Panel</h2>
          </div>
        )}

        <IconButton
          onClick={onToggleCollapse}
          className="hidden border border-slate-200 dark:border-slate-700 lg:inline-flex"
        >
          {collapsed ? <KeyboardDoubleArrowRightRoundedIcon /> : <KeyboardDoubleArrowLeftRoundedIcon />}
        </IconButton>
      </div>  

      <div className="mt-8 flex-1 overflow-y-auto">
        {['Overview', 'Management', 'Operations', 'Finance'].map((section) => {
          const items = navigationItems.filter((item) => item.section === section)

          if (!items.length) {
            return null
          }

          return (
            <div key={section} className="mb-6">
              {!collapsed && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {section}
                </p>
              )}

              <List className="space-y-1">
                {items.map((item) => {
                  const Icon = iconMap[item.label]

                  return (
                    <ListItemButton
                      key={item.path}
                      component={NavLink}
                      to={item.path}
                      onClick={onCloseMobile}
                      className="rounded-2xl px-3 py-2.5 text-slate-600 transition hover:bg-sky-50 hover:text-sky-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-300"
                      sx={{
                        '&.active': {
                          backgroundColor: 'rgba(14, 165, 233, 0.12)',
                          color: 'primary.main',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: collapsed ? 0 : 40,
                          color: 'inherit',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon />
                      </ListItemIcon>
                      {!collapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />}
                    </ListItemButton>
                  )
                })}
              </List>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onCloseMobile}
        ModalProps={{ keepMounted: true }}
        className="lg:hidden"
        PaperProps={{ className: 'w-[280px]' }}
      >
        {sidebarContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        className="hidden lg:block"
        PaperProps={{
          className: `${collapsed ? 'w-[92px]' : 'w-[280px]'} overflow-hidden border-r border-slate-200/70 dark:border-slate-800 transition-[width] duration-300 ease-in-out`,
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  )
}

export default Sidebar
