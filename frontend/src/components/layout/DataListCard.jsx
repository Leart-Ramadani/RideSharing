import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function DataListCard({ items, subtitle, title }) {
  return (
    <Paper
      elevation={0}
      className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
    >
      <Typography variant="h6" className="text-slate-900 dark:text-slate-100">
        {title}
      </Typography>
      <Typography className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</Typography>

      <Stack spacing={0} className="mt-5">
        {items.map((item) => (
          <div
            key={item.primary}
            className="flex flex-col gap-2 border-b border-slate-200/70 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800"
          >
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{item.primary}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.secondary}</p>
            </div>
            <div className="text-sm font-medium text-sky-600 dark:text-sky-400">{item.value}</div>
          </div>
        ))}
      </Stack>
    </Paper>
  )
}

export default DataListCard
