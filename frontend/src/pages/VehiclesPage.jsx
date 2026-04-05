import DataListCard from '../components/layout/DataListCard'
import PageIntro from '../components/layout/PageIntro'
import StatsGrid from '../components/layout/StatsGrid'

const stats = [
  { label: 'Available vehicles', value: '289', change: '+10 ready for dispatch' },
  { label: 'Maintenance due', value: '23', change: '6 require inspection' },
  { label: 'Electric vehicles', value: '52', change: '+8 in the fleet' },
  { label: 'Unassigned units', value: '11', change: 'Needs matching' },
]

const vehicles = [
  { primary: 'Toyota Prius 2024', secondary: 'Assigned to Amina Yusuf • Plate RS-2041', value: 'Active' },
  { primary: 'Tesla Model 3', secondary: 'Fast-charge ready • Downtown station', value: 'Available' },
  { primary: 'Hyundai Accent', secondary: 'Inspection scheduled tomorrow morning', value: 'Maintenance' },
]

function VehiclesPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Management"
        title="Vehicles"
        text="A simple fleet page to track assignments, readiness, and maintenance status."
      />
      <StatsGrid items={stats} />
      <DataListCard
        title="Fleet activity"
        subtitle="Starter content for vehicle-related administration."
        items={vehicles}
      />
    </div>
  )
}

export default VehiclesPage
