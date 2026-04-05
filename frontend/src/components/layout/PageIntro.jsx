import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

function PageIntro({ eyebrow, text, title }) {
  return (
    <Paper
      elevation={0}
      className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80"
    >
      <Stack spacing={1}>
        <Typography className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">
          {eyebrow}
        </Typography>
        <Typography variant="h5" className="text-slate-900 dark:text-slate-100">
          {title}
        </Typography>
        <Typography className="max-w-3xl text-slate-500 dark:text-slate-400">{text}</Typography>
      </Stack>
    </Paper>
  )
}

export default PageIntro
