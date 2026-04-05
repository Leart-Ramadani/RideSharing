import DataListCard from '../components/layout/DataListCard'
import PageIntro from '../components/layout/PageIntro'
import StatsGrid from '../components/layout/StatsGrid'

const stats = [
  { label: 'Live rides', value: '126', change: '+18 in last 15 min' },
  { label: 'Scheduled rides', value: '312', change: '84 for tomorrow' },
  { label: 'Completed today', value: '2,481', change: '+8.4% growth' },
  { label: 'Cancelled trips', value: '64', change: '-6 since yesterday' },
]

const rides = [
  { primary: 'Airport pickup queue', secondary: '17 rides waiting for nearby drivers', value: 'Priority' },
  { primary: 'Downtown commuter block', secondary: 'High traffic but stable trip flow', value: 'Stable' },
  { primary: 'Corporate bookings', secondary: '12 pre-scheduled rides in progress', value: 'On time' },
]

function RidesPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Operations"
        title="Rides"
        text="Use this route for trip monitoring, dispatch actions, and service-level tracking."
      />
      <StatsGrid items={stats} />
      <DataListCard
        title="Trip operations"
        subtitle="Sample ride records and operational notes."
        items={rides}
      />
    </div>
  )
}

export default RidesPage
