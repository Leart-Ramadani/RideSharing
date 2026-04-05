import DataListCard from '../components/layout/DataListCard'
import PageIntro from '../components/layout/PageIntro'
import StatsGrid from '../components/layout/StatsGrid'

const stats = [
  { label: 'Active passengers', value: '8,420', change: '+184 this week' },
  { label: 'Support flags', value: '13', change: '3 need follow-up' },
  { label: 'New signups', value: '256', change: '+9% today' },
  { label: 'Average trip spend', value: '$17.40', change: '+$1.10 this month' },
]

const passengers = [
  { primary: 'Sara Johnson', secondary: 'Completed 48 rides • Premium member', value: 'Healthy account' },
  { primary: 'Niko Petrov', secondary: 'Recent refund request under review', value: 'Needs review' },
  { primary: 'Maria Chen', secondary: 'Top airport route customer', value: 'Frequent rider' },
]

function PassengersPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Management"
        title="Passengers"
        text="Monitor rider growth, account health, and support-related issues from one place."
      />
      <StatsGrid items={stats} />
      <DataListCard
        title="Passenger insights"
        subtitle="Example rider data blocks for your admin dashboard."
        items={passengers}
      />
    </div>
  )
}

export default PassengersPage
