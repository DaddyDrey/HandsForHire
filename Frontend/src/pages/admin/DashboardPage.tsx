import { Box, Typography, Paper, Chip, useTheme } from "@mui/material";
import type { ChipProps } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// ── Metric card ──────────────────────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaType?: "up" | "down" | "warn";
  accent?: boolean;
}

function MetricCard({ label, value, delta, deltaType = "up", accent }: MetricCardProps) {
  const theme = useTheme();
  const deltaColor =
    deltaType === "up" ? "#22C55E" : deltaType === "down" ? "#F87171" : "#FBBF24";

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        bgcolor: "#131929",
        border: `1px solid ${theme.palette.divider}`,
        borderTop: accent ? `2px solid ${theme.palette.primary.main}` : undefined,
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Typography variant="caption" color="text.secondary" display="block" mb={0.75}>
        {label}
      </Typography>
      <Typography variant="h5" fontWeight={500} color="text.primary">
        {value}
      </Typography>
      {delta && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
          {deltaType === "up" ? (
            <TrendingUpIcon sx={{ fontSize: 14, color: deltaColor }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 14, color: deltaColor }} />
          )}
          <Typography variant="caption" sx={{ color: deltaColor }}>
            {delta}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// ── Bar chart ─────────────────────────────────────────────────────────────────
const signupData = [
  { label: "Feb", value: 28 },
  { label: "Mar", value: 41 },
  { label: "Apr", value: 35 },
  { label: "May", value: 52 },
  { label: "Jun", value: 48 },
  { label: "Jul", value: 61 },
  { label: "Aug", value: 74 },
  { label: "Sep", value: 89 },
];

function BarChart() {
  const theme = useTheme();
  const max = Math.max(...signupData.map((d) => d.value));

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 110, px: 1, pt: 1 }}>
      {signupData.map((d) => (
        <Box
          key={d.label}
          sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5 }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.6rem" }}>
            {d.value}
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: `${Math.round((d.value / max) * 80)}px`,
              borderRadius: "4px 4px 0 0",
              bgcolor: "rgba(124,92,255,0.25)",
              transition: "background .2s",
              "&:hover": { bgcolor: theme.palette.primary.main },
              cursor: "default",
            }}
          />
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.6rem" }}>
            {d.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
const donutData = [
  { label: "Open", pct: 40, color: "#7C5CFF" },
  { label: "In progress", pct: 35, color: "#22C55E" },
  { label: "Cancelled", pct: 9, color: "#F87171" },
  { label: "Completed", pct: 16, color: "#5A6278" },
];

function DonutChart() {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const segments = donutData.map((d, index) => {
    const previousPct = donutData.slice(0, index).reduce((total, item) => total + item.pct, 0);
    return {
      ...d,
      dash: (d.pct / 100) * circ,
      offset: (previousPct / 100) * circ,
    };
  });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, p: 2 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        {segments.map((d) => (
            <circle
              key={d.label}
              cx="50" cy="50" r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="14"
              strokeDasharray={`${d.dash} ${circ}`}
              strokeDashoffset={-d.offset}
              transform="rotate(-90 50 50)"
            />
        ))}
      </svg>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {donutData.map((d) => (
          <Box key={d.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: d.color, flexShrink: 0 }} />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
              {d.label} — {d.pct}%
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── Recent activity ───────────────────────────────────────────────────────────
const activity: Array<{
  event: string;
  user: string;
  time: string;
  status: string;
  color: ChipProps["color"];
}> = [
  { event: "New signup", user: "alex.m@email.com", time: "2 min ago", status: "OK", color: "success" },
  { event: "Job posted", user: "maria.p@email.com", time: "14 min ago", status: "Live", color: "primary" },
  { event: "Report filed", user: "john.d@email.com", time: "31 min ago", status: "Review", color: "warning" },
  { event: "Pro approved", user: "stefan.r@email.com", time: "1 hr ago", status: "Approved", color: "success" },
  { event: "Account deleted", user: "temp_user_882", time: "2 hr ago", status: "Removed", color: "default" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Overview of platform activity
      </Typography>

      {/* Metrics */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1.5, mb: 3 }}>
        {[
          { label: "Total users", value: "1,284", delta: "+38 this week", deltaType: "up" as const, accent: true },
          { label: "Active pros", value: "317", delta: "+12 this week", deltaType: "up" as const },
          { label: "Open jobs", value: "89", delta: "−5 since yesterday", deltaType: "down" as const },
          { label: "Pending reports", value: "4", delta: "Needs attention", deltaType: "warn" as const },
        ].map((m) => (
          <MetricCard key={m.label} {...m} />
        ))}
      </Box>

      {/* Charts row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" }, gap: 2, mb: 3 }}>
        <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" fontWeight={500}>New signups — last 8 weeks</Typography>
          </Box>
          <BarChart />
        </Paper>
        <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
          <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" fontWeight={500}>Job listings status</Typography>
          </Box>
          <DonutChart />
        </Paper>
      </Box>

      {/* Recent activity */}
      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" fontWeight={500}>Recent activity</Typography>
        </Box>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead">
            <Box component="tr">
              {["Event", "User", "Time", "Status"].map((h) => (
                <Box
                  key={h}
                  component="th"
                  sx={{ px: 2.5, py: 1.25, textAlign: "left", fontSize: "0.65rem", color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: `1px solid ${theme.palette.divider}`, fontWeight: 500 }}
                >
                  {h}
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {activity.map((row, i) => (
              <Box
                key={i}
                component="tr"
                sx={{ "&:hover td": { bgcolor: "rgba(255,255,255,0.02)" }, "&:last-child td": { borderBottom: "none" } }}
              >
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {row.event}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.primary", fontWeight: 500, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {row.user}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {row.time}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Chip label={row.status} size="small" color={row.color} variant="outlined" sx={{ fontSize: "0.65rem", height: 20 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
