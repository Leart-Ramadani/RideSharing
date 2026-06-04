import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import api from '../services/api'

const roleColors = { ADMIN: 'error', DRIVER: 'primary', PASSENGER: 'success' }

function RolesPage() {
  const [roles, setRoles] = useState([])

  useEffect(() => {
    api.get('/roles').then((r) => setRoles(r.data)).catch(() => {})
  }, [])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Roles</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          System roles are fixed and cannot be created or deleted.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>System Roles</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Normalized Name</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>
                    <Chip label={r.name} color={roleColors[r.normalized_name] ?? 'default'} size="small" />
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'monospace', fontSize: 13 }}>{r.normalized_name}</TableCell>
                  <TableCell>{r.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default RolesPage
