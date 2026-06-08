import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import api from '../services/api'

function PassengerWalletPage() {
  const [wallet, setWallet]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [topUpOpen, setTopUpOpen] = useState(false)
  const [amount, setAmount]       = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState('')

  const fetchWallet = () => {
    setLoading(true)
    api.get('/passenger/wallet')
      .then((r) => setWallet(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchWallet() }, [])

  const handleTopUp = async () => {
    setError('')
    const parsed = parseFloat(amount)
    if (!parsed || parsed < 1) {
      setError('Minimum top-up amount is €1.00')
      return
    }
    setSaving(true)
    try {
      await api.post('/passenger/wallet/top-up', { amount: parsed })
      setSuccess(`€${parsed.toFixed(2)} added to your wallet.`)
      setTopUpOpen(false)
      setAmount('')
      fetchWallet()
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'Top-up failed.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight={700}>My Wallet</Typography>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => { setTopUpOpen(true); setError(''); setSuccess('') }}
          sx={{ fontWeight: 700 }}
        >
          Add Funds
        </Button>
      </Box>

      {success && <Alert severity="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Balance Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)'
              : 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <AccountBalanceWalletRoundedIcon sx={{ fontSize: 56, opacity: 0.9 }} />
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>Available Balance</Typography>
          <Typography variant="h3" fontWeight={800}>
            €{Number(wallet?.balance ?? 0).toFixed(2)}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.75 }}>
            Use your balance to pay for rides automatically
          </Typography>
        </Box>
      </Paper>

      {/* Transaction History */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Transaction History</Typography>
        <Divider sx={{ mb: 2 }} />

        {wallet?.transactions?.length === 0 ? (
          <Typography color="text.secondary" sx={{ py: 2 }}>
            No transactions yet. Add funds to get started!
          </Typography>
        ) : (
          wallet?.transactions?.map((tx) => (
            <Box
              key={tx.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 1.5,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                {tx.type === 'credit' ? (
                  <ArrowUpwardRoundedIcon color="success" />
                ) : (
                  <ArrowDownwardRoundedIcon color="error" />
                )}
                <Box>
                  <Typography fontWeight={500}>{tx.description || (tx.type === 'credit' ? 'Top-up' : 'Payment')}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(tx.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Typography
                fontWeight={700}
                color={tx.type === 'credit' ? 'success.main' : 'error.main'}
              >
                {tx.type === 'credit' ? '+' : '-'}€{Number(tx.amount).toFixed(2)}
              </Typography>
            </Box>
          ))
        )}
      </Paper>

      {/* Top-up Dialog */}
      <Dialog open={topUpOpen} onClose={() => setTopUpOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Add Funds to Wallet</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Enter the amount you want to add. Minimum €1.00, maximum €500.00.
          </Typography>
          <TextField
            label="Amount (€)"
            type="number"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputProps={{ min: 1, max: 500, step: 0.5 }}
            autoFocus
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={() => setTopUpOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTopUp} disabled={saving} sx={{ fontWeight: 700 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Add Funds'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PassengerWalletPage
