import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

function StatsGrid({ items }) {
  return (
    <Grid container spacing={3}>
      {items.map((item) => (
        <Grid key={item.label} size={{ xs: 12, md: 6, xl: 3 }}>
          <Paper
            elevation={0}
            className="rounded-[24px] border border-slate-200/70 bg-white/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80"
          >
            <Typography className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {item.label}
            </Typography>
            <Typography variant="h4" className="mt-4 text-slate-900 dark:text-slate-100">
              {item.value}
            </Typography>
            <Typography className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
              {item.change}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}

export default StatsGrid
