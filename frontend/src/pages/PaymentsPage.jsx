import DataListCard from '../components/layout/DataListCard'
import PageIntro from '../components/layout/PageIntro'
import StatsGrid from '../components/layout/StatsGrid'

const stats = [
  { label: 'Today revenue', value: '$48,220', change: '+11.2% vs yesterday' },
  { label: 'Pending payouts', value: '$12,840', change: '15 driver batches' },
  { label: 'Refund requests', value: '9', change: '2 require manual review' },
  { label: 'Payment success rate', value: '98.9%', change: 'Stable processing' },
]

const payments = [
  { primary: 'Driver payout batch', secondary: 'Scheduled for 18:00 local time', value: '$8,420' },
  { primary: 'Refund queue', secondary: 'Customer support approved 4 refunds', value: '$186' },
  { primary: 'Corporate invoices', secondary: '7 invoices waiting for export', value: 'Pending' },
]

function PaymentsPage() {
  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Finance"
        title="Payments"
        text="A starter payment management page for settlements, refunds, and billing summaries."
      />
      <StatsGrid items={stats} />
      <DataListCard
        title="Recent finance activity"
        subtitle="Example payment and settlement items for the admin shell."
        items={payments}
      />
    </div>
  )
}

export default PaymentsPage
