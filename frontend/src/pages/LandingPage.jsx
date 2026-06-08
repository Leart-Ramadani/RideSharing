import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import DirectionsCarFilledRoundedIcon from '@mui/icons-material/DirectionsCarFilledRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import DriveEtaRoundedIcon from '@mui/icons-material/DriveEtaRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import MapRoundedIcon from '@mui/icons-material/MapRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import RouteRoundedIcon from '@mui/icons-material/RouteRounded'
import { Link } from 'react-router-dom'

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */

/** A single feature card */
function FeatureCard({ icon, title, description }) {
  const theme = useTheme()
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        transition: 'transform .2s, box-shadow .2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 12px 40px rgba(0,0,0,.5)'
            : '0 12px 40px rgba(0,0,0,.08)',
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 3,
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography fontWeight={700}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
        {description}
      </Typography>
    </Paper>
  )
}

/** A numbered "how it works" step */
function StepCard({ number, title, description }) {
  return (
    <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          color: '#fff',
          fontWeight: 800,
          fontSize: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mt: 0.3,
        }}
      >
        {number}
      </Box>
      <Box>
        <Typography fontWeight={700} gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
          {description}
        </Typography>
      </Box>
    </Box>
  )
}

/** A role highlight card (Passenger / Driver / Admin) */
function RoleCard({ icon, role, color, features }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ color, fontSize: 0 }}>{icon}</Box>
        <Typography variant="h6" fontWeight={700}>{role}</Typography>
      </Box>
      <Divider />
      <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
        {features.map((f) => (
          <Typography key={f} component="li" variant="body2" color="text.secondary" lineHeight={1.6}>
            {f}
          </Typography>
        ))}
      </Box>
    </Paper>
  )
}

/* ─── main component ────────────────────────────────────────────────────────── */

function LandingPage({ colorMode, onToggleColorMode }) {
  const theme   = useTheme()
  const isDark  = theme.palette.mode === 'dark'
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Gradient used in the hero section
  const heroGradient = isDark
    ? 'linear-gradient(135deg, #0c4a6e 0%, #0f172a 60%)'
    : 'linear-gradient(135deg, #0284c7 0%, #e0f2fe 100%)'

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>

      {/* ─── NAVBAR ────────────────────────────────────────────────────────── */}
      <Box
        component="nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(16px)',
          bgcolor: isDark ? 'rgba(15,23,42,.85)' : 'rgba(255,255,255,.85)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCarFilledRoundedIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography variant="h6" fontWeight={800} color="primary.main" letterSpacing={-0.5}>
                RideSharing
              </Typography>
            </Box>

            {/* Nav links — hidden on mobile */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 3.5 }}>
                {['About', 'Features', 'How It Works', 'Roles'].map((label) => (
                  <Typography
                    key={label}
                    component="a"
                    href={`#${label.toLowerCase().replace(/ /g, '-')}`}
                    variant="body2"
                    fontWeight={500}
                    color="text.secondary"
                    sx={{
                      textDecoration: 'none',
                      cursor: 'pointer',
                      '&:hover': { color: 'primary.main' },
                      transition: 'color .15s',
                    }}
                  >
                    {label}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Right side actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Dark / light toggle */}
              <IconButton onClick={onToggleColorMode} size="small" color="inherit">
                {isDark ? <LightModeRoundedIcon fontSize="small" /> : <DarkModeRoundedIcon fontSize="small" />}
              </IconButton>

              {!isMobile && (
                <Button
                  component={Link}
                  to="/register"
                  variant="text"
                  size="small"
                  sx={{ fontWeight: 600, color: 'text.secondary' }}
                >
                  Register
                </Button>
              )}

              <Button
                component={Link}
                to="/login"
                variant="contained"
                size="small"
                sx={{ fontWeight: 700, px: 2.5, borderRadius: 99 }}
              >
                Login
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── HERO ──────────────────────────────────────────────────────────── */}
      <Box
        id="about"
        sx={{
          background: heroGradient,
          py: { xs: 10, md: 16 },
          px: 2,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blurred circles */}
        <Box sx={{
          position: 'absolute', top: -80, right: -80,
          width: 320, height: 320, borderRadius: '50%',
          bgcolor: 'primary.main', opacity: .12, filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -60, left: -60,
          width: 260, height: 260, borderRadius: '50%',
          bgcolor: 'secondary.main', opacity: .10, filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Chip
            label="University Project — Full-Stack Web App"
            size="small"
            sx={{
              mb: 3,
              fontWeight: 600,
              bgcolor: isDark ? 'rgba(56,189,248,.15)' : 'rgba(2,132,199,.12)',
              color: 'primary.main',
              border: '1px solid',
              borderColor: isDark ? 'rgba(56,189,248,.3)' : 'rgba(2,132,199,.25)',
            }}
          />

          <Typography
            variant={isMobile ? 'h4' : 'h2'}
            fontWeight={800}
            color={isDark ? '#f0f9ff' : '#0c4a6e'}
            lineHeight={1.15}
            letterSpacing={-1}
            gutterBottom
          >
            The smarter way to<br />
            <Box component="span" sx={{ color: 'primary.main' }}>get around.</Box>
          </Typography>

          <Typography
            variant="h6"
            fontWeight={400}
            color={isDark ? '#94a3b8' : '#075985'}
            sx={{ mt: 2, mb: 5, maxWidth: 560, mx: 'auto', lineHeight: 1.7 }}
          >
            RideSharing connects passengers with nearby drivers in real time.
            Book rides instantly, pay digitally, track your trip, and rate your experience —
            all from one platform.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{ px: 5, py: 1.5, fontWeight: 800, borderRadius: 99, fontSize: 15 }}
            >
              Get Started — It's Free
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 5, py: 1.5, fontWeight: 700, borderRadius: 99, fontSize: 15,
                borderColor: isDark ? 'rgba(56,189,248,.4)' : undefined,
                color: isDark ? '#38bdf8' : undefined,
                '&:hover': { borderColor: 'primary.main' },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── STATS BAR ─────────────────────────────────────────────────────── */}
      <Box sx={{ bgcolor: 'primary.main', py: 3, px: 2 }}>
        <Container maxWidth="md">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            {[
              { value: '3 Roles',   label: 'Passenger · Driver · Admin' },
              { value: 'JWT Auth',  label: 'Secure token-based login' },
              { value: 'Wallet',    label: 'Digital payment system' },
              { value: 'Live Map',  label: 'Leaflet-powered tracking' },
            ].map((s) => (
              <Box key={s.value} sx={{ textAlign: 'center', color: '#fff' }}>
                <Typography fontWeight={800} fontSize={18}>{s.value}</Typography>
                <Typography variant="caption" sx={{ opacity: .8 }}>{s.label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ─── FEATURES ──────────────────────────────────────────────────────── */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Everything you need, built in.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
              From booking to payment to analytics — RideSharing covers the full ride lifecycle
              out of the box.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 3,
            }}
          >
            <FeatureCard
              icon={<MapRoundedIcon />}
              title="Interactive Map"
              description="Powered by Leaflet and OpenStreetMap. Passengers see their pickup and dropoff pins on a real map before and during the ride."
            />
            <FeatureCard
              icon={<AccountBalanceWalletRoundedIcon />}
              title="Digital Wallet"
              description="Passengers top up their wallet balance and rides are charged automatically on completion. Full transaction history included."
            />
            <FeatureCard
              icon={<StarRoundedIcon />}
              title="Ratings & Reviews"
              description="After every completed ride, passengers can rate the driver with a star score and optional comment. Average ratings update in real time."
            />
            <FeatureCard
              icon={<SpeedRoundedIcon />}
              title="Fare Estimation"
              description="Passengers see a price estimate for each service tier (Standard, Premium, XL) before submitting their request — no surprises."
            />
            <FeatureCard
              icon={<SecurityRoundedIcon />}
              title="JWT Authentication"
              description="Secure login with access and refresh tokens. Role-based authorization ensures each user only sees what they're allowed to."
            />
            <FeatureCard
              icon={<RouteRoundedIcon />}
              title="Full Ride Lifecycle"
              description="From request → accept → in-progress → complete. Drivers accept pending requests, update status, enter distance, and the fare is auto-calculated."
            />
          </Box>
        </Container>
      </Box>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <Box
        id="how-it-works"
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          bgcolor: isDark ? 'rgba(255,255,255,.02)' : 'rgba(2,132,199,.03)',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: { xs: 6, md: 10 },
              alignItems: 'center',
            }}
          >
            {/* Left — heading */}
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                How it works
              </Typography>
              <Typography color="text.secondary" lineHeight={1.8} sx={{ mb: 4 }}>
                Three simple steps — that's all it takes to go from opening the app to
                being dropped off at your destination.
              </Typography>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{ fontWeight: 700, px: 4, borderRadius: 99 }}
              >
                Create an Account
              </Button>
            </Box>

            {/* Right — steps */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <StepCard
                number="1"
                title="Create your account"
                description="Register as a Passenger or Driver. Passengers get a digital wallet pre-configured. Drivers register their vehicle and license."
              />
              <StepCard
                number="2"
                title="Request or accept a ride"
                description="Passengers submit a ride request with pickup and dropoff details. Online drivers see it instantly and can accept with one click."
              />
              <StepCard
                number="3"
                title="Complete the trip & pay"
                description="The driver starts the trip, enters the final distance, and marks it complete. The fare is calculated automatically and deducted from the passenger's wallet."
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ─── ROLES ─────────────────────────────────────────────────────────── */}
      <Box id="roles" sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 7 }}>
            <Typography variant="h4" fontWeight={800} gutterBottom>
              Built for three roles.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 460, mx: 'auto' }}>
              Each role has its own dashboard, features, and protected routes.
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
              gap: 3,
            }}
          >
            <RoleCard
              icon={<PersonRoundedIcon sx={{ fontSize: 32 }} />}
              role="Passenger"
              color={theme.palette.primary.main}
              features={[
                'Request rides with pickup & dropoff',
                'Choose service type (Standard / Premium / XL)',
                'See fare estimate before booking',
                'Track ride status in real time',
                'Pay automatically from digital wallet',
                'Rate the driver after every trip',
                'View full ride & transaction history',
              ]}
            />
            <RoleCard
              icon={<DriveEtaRoundedIcon sx={{ fontSize: 32 }} />}
              role="Driver"
              color={theme.palette.secondary.main}
              features={[
                'Go online / offline with one toggle',
                'See all pending passenger requests',
                'Accept or reject incoming requests',
                'View pickup & dropoff on a map',
                'Mark trip started and completed',
                'Enter distance to trigger fare calc',
                'See earnings and ride history',
              ]}
            />
            <RoleCard
              icon={<AdminPanelSettingsRoundedIcon sx={{ fontSize: 32 }} />}
              role="Admin"
              color="#f59e0b"
              features={[
                'Full dashboard with analytics charts',
                'Manage users, drivers, passengers',
                'Monitor all rides and requests',
                'Configure fare rates per service type',
                'Manage promo codes & discounts',
                'View all payments and transactions',
                'Manage driver payout periods',
              ]}
            />
          </Box>
        </Container>
      </Box>

      {/* ─── CALL TO ACTION ────────────────────────────────────────────────── */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          background: heroGradient,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 400, height: 200, borderRadius: '50%',
          bgcolor: 'primary.main', opacity: .1, filter: 'blur(50px)',
          pointerEvents: 'none',
        }} />
        <Container maxWidth="sm" sx={{ position: 'relative' }}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            fontWeight={800}
            color={isDark ? '#f0f9ff' : '#0c4a6e'}
            gutterBottom
          >
            Ready to ride?
          </Typography>
          <Typography
            color={isDark ? '#94a3b8' : '#075985'}
            sx={{ mb: 4, lineHeight: 1.7 }}
          >
            Join RideSharing today. Create a passenger or driver account in under a minute —
            no credit card required for passengers.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              size="large"
              sx={{ px: 5, fontWeight: 800, borderRadius: 99 }}
            >
              Create Account
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                px: 5, fontWeight: 700, borderRadius: 99,
                borderColor: isDark ? 'rgba(56,189,248,.4)' : undefined,
                color: isDark ? '#38bdf8' : undefined,
              }}
            >
              Sign In
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ─── FOOTER ────────────────────────────────────────────────────────── */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DirectionsCarFilledRoundedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography fontWeight={700} color="primary.main">RideSharing</Typography>
            </Box>

            <Typography variant="caption" color="text.secondary">
              Built with Laravel 13 · React 19 · Material UI · MySQL
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                component={Link}
                to="/login"
                size="small"
                variant="outlined"
                sx={{ borderRadius: 99, fontWeight: 600 }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                size="small"
                variant="contained"
                sx={{ borderRadius: 99, fontWeight: 600 }}
              >
                Register
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

    </Box>
  )
}

export default LandingPage
