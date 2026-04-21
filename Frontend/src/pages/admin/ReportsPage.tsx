import { useState } from "react";
import {
  Box, Typography, Paper, Chip, Button, Tabs, Tab,
  useTheme
} from "@mui/material";

interface Report {
  id: number;
  title: string;
  reportedBy: string;
  date: string;
  category: string;
  severity: "high" | "medium";
  resolved?: boolean;
}

const PENDING: Report[] = [
  { id: 1, title: "Pro no-show — Stefan Rusu", reportedBy: "alex.m@email.com", date: "Apr 15, 2025", category: "Reliability", severity: "high" },
  { id: 2, title: "Inappropriate message in chat", reportedBy: "maria.p@email.com", date: "Apr 14, 2025", category: "Conduct", severity: "medium" },
  { id: 3, title: "Fake profile photo detected", reportedBy: "System", date: "Apr 13, 2025", category: "Fraud", severity: "medium" },
  { id: 4, title: "Payment dispute — job #1092", reportedBy: "john.d@email.com", date: "Apr 12, 2025", category: "Payment", severity: "high" },
];

const RESOLVED: Report[] = [
  { id: 5, title: "Spam job listing removed", reportedBy: "System", date: "Apr 10, 2025", category: "Spam", severity: "medium", resolved: true },
  { id: 6, title: "Duplicate account merged", reportedBy: "admin", date: "Apr 9, 2025", category: "Fraud", severity: "medium", resolved: true },
  { id: 7, title: "Offensive review deleted", reportedBy: "nina.k@email.com", date: "Apr 7, 2025", category: "Conduct", severity: "medium", resolved: true },
];

const categoryStats = [
  { label: "Conduct", count: 12 },
  { label: "Reliability", count: 8 },
  { label: "Payment", count: 5 },
  { label: "Fraud", count: 3 },
  { label: "Other", count: 2 },
];

const resolutionStats = [
  { label: "Avg resolution time", value: "1.4 days" },
  { label: "Resolved this month", value: "18" },
  { label: "Pending", value: "4", warn: true },
  { label: "Actions taken", value: "9 suspensions" },
];

export default function ReportsPage() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const severityDot = (s: "high" | "medium") => (
    <Box
      sx={{
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0, mt: "5px",
        bgcolor: s === "high" ? "#F87171" : "#FBBF24",
      }}
    />
  );

  const reportList = tab === 0 ? PENDING : RESOLVED;

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>Reports &amp; flags</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        User-submitted reports that need moderation
      </Typography>

      {/* Tabs + list */}
      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden", mb: 2.5 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            minHeight: 42,
            "& .MuiTab-root": { minHeight: 42, fontSize: "0.8rem", textTransform: "none", fontWeight: 400, color: "text.secondary" },
            "& .Mui-selected": { color: "primary.main", fontWeight: 500 },
            "& .MuiTabs-indicator": { bgcolor: "primary.main" },
          }}
        >
          <Tab label={`Pending (${PENDING.length})`} />
          <Tab label={`Resolved (${RESOLVED.length})`} />
        </Tabs>

        {reportList.map((r, i) => (
          <Box
            key={r.id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              px: 2.5,
              py: 1.75,
              borderBottom: i < reportList.length - 1 ? `1px solid ${theme.palette.divider}` : "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
            }}
          >
            {!r.resolved && severityDot(r.severity)}
            {r.resolved && (
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, mt: "5px", bgcolor: "#22C55E" }} />
            )}

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" color="text.primary" fontWeight={500} sx={{ mb: 0.25 }}>
                {r.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                Reported by {r.reportedBy} · {r.date} · {r.category}
              </Typography>
            </Box>

            {r.resolved ? (
              <Chip label="Resolved" size="small" color="success" variant="outlined" sx={{ fontSize: "0.65rem", height: 20, flexShrink: 0 }} />
            ) : (
              <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                <Button size="small" variant="outlined" sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}>
                  Review
                </Button>
                {r.category === "Reliability" || r.category === "Fraud" ? (
                  <Button size="small" variant="outlined" sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "error.main", color: "error.main" } }}>
                    Suspend
                  </Button>
                ) : r.category === "Payment" ? (
                  <Button size="small" variant="outlined" sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "warning.main", color: "warning.main" } }}>
                    Escalate
                  </Button>
                ) : (
                  <Button size="small" variant="outlined" sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "warning.main", color: "warning.main" } }}>
                    Warn user
                  </Button>
                )}
              </Box>
            )}
          </Box>
        ))}
      </Paper>

      {/* Stats row */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" fontWeight={500}>Reports by category</Typography>
          </Box>
          {categoryStats.map((s, i) => (
            <Box
              key={s.label}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2.5,
                py: 1.1,
                borderBottom: i < categoryStats.length - 1 ? `1px solid ${theme.palette.divider}` : "none",
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>{s.label}</Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500} sx={{ fontSize: "0.8rem" }}>{s.count}</Typography>
            </Box>
          ))}
        </Paper>

        <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" fontWeight={500}>Resolution stats</Typography>
          </Box>
          {resolutionStats.map((s, i) => (
            <Box
              key={s.label}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2.5,
                py: 1.1,
                borderBottom: i < resolutionStats.length - 1 ? `1px solid ${theme.palette.divider}` : "none",
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>{s.label}</Typography>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: "0.8rem", color: s.warn ? "#FBBF24" : "text.primary" }}>{s.value}</Typography>
            </Box>
          ))}
        </Paper>
      </Box>
    </Box>
  );
}
