import DataListCard from '../components/layout/DataListCard'
import PageIntro from '../components/layout/PageIntro'
import StatsGrid from '../components/layout/StatsGrid'

const stats = [
  { label: 'Active drivers', value: '342', change: '+14 added today' },
  { label: 'Verification queue', value: '18', change: '5 urgent reviews' },
  { label: 'Suspended accounts', value: '7', change: '-2 from yesterday' },
  { label: 'Average rating', value: '4.8', change: 'Stable quality score' },
]

const drivers = [
  { primary: 'Amina Yusuf', secondary: 'Toyota Prius • Verified and online', value: '4.9 rating' },
  { primary: 'Daniel Cruz', secondary: 'Honda City • Waiting for insurance check', value: 'Pending docs' },
  { primary: 'Layla Nasser', secondary: 'Kia Rio • Completed 16 rides today', value: 'High performer' },
]

function DriversPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Management"
        title="Drivers"
        text="Use this page to manage onboarding, review driver readiness, and monitor workforce quality."
      />
      <StatsGrid items={stats} />
      <DataListCard
        title="Driver list preview"
        subtitle="Example content showing how driver records can fit inside the admin layout."
        items={drivers}
      />
    </div>
  )
}

export default DriversPage
