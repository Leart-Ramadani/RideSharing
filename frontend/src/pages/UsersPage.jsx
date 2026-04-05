import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

const users = [
  { name: 'Amelia Stone', role: 'Driver', status: 'Approved' },
  { name: 'Darius Cole', role: 'Rider', status: 'Flagged for review' },
  { name: 'Lina Park', role: 'Support', status: 'Active' },
]

function UsersPage() {
  return (
    <Stack spacing={3}>
      <Paper elevation={0} className="content-card">
        <Typography variant="h6" gutterBottom>
          User management test page
        </Typography>
        <Typography className="card-copy">
          This second plain page exists to confirm the layout persists while the content area
          changes. The sidebar and top bar remain shared at layout level.
        </Typography>
      </Paper>

      <Paper elevation={0} className="content-card">
        <Typography variant="h6" gutterBottom>
          Sample users
        </Typography>
        <Stack spacing={1.5}>
          {users.map((user) => (
            <Stack
              key={user.name}
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              spacing={0.75}
              className="list-row"
            >
              <BoxBlock label="Name" value={user.name} />
              <BoxBlock label="Role" value={user.role} />
              <BoxBlock label="Status" value={user.status} align="right" />
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Stack>
  )
}

function BoxBlock({ align = 'left', label, value }) {
  return (
    <Stack sx={{ textAlign: align }}>
      <Typography className="row-label">{label}</Typography>
      <Typography className="row-value">{value}</Typography>
    </Stack>
  )
}

export default UsersPage
