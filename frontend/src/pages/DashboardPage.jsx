import Grid from '@mui/material/Grid'
import DataListCard from '../components/layout/DataListCard'
import PageIntro from '../components/layout/PageIntro'
import StatsGrid from '../components/layout/StatsGrid'

const stats = [
  { label: 'Completed rides', value: '2,481', change: '+8.4% vs yesterday' },
  { label: 'Online drivers', value: '342', change: '+21 newly active' },
  { label: 'New passengers', value: '184', change: '+12.1% this week' },
  { label: 'Pending payouts', value: '$12,840', change: '15 scheduled today' },
]

const activities = [
  { primary: 'Airport surge zone', secondary: 'Demand exceeded supply for 22 minutes', value: 'Monitor now' },
  { primary: 'Driver onboarding', secondary: '18 profiles waiting for document review', value: '18 pending' },
  { primary: 'Payment reconciliation', secondary: 'Night batch completed successfully', value: 'Completed' },
]

const performance = [
  { primary: 'Ride acceptance rate', secondary: 'Average across all active drivers', value: '91%' },
  { primary: 'Average trip duration', secondary: 'Based on last 24 hours of trips', value: '18 min' },
  { primary: 'Cancellation rate', secondary: 'Measured across rider and driver initiated trips', value: '2.6%' },
]

function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Overview"
        title="Operations dashboard"
        text="A clean starter dashboard for your Laravel + React admin area. Replace the sample cards with live metrics once your APIs are connected."
      />

      <StatsGrid items={stats} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <DataListCard
            title="Latest operations activity"
            subtitle="Sample events for the dashboard home page."
            items={activities}
          />
        </Grid>
        <Grid size={{ xs: 12, xl: 5 }}>
          <DataListCard
            title="Platform performance"
            subtitle="Quick operational indicators for dispatch health."
            items={performance}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default DashboardPage
