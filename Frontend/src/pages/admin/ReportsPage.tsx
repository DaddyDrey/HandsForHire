import { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, Paper, Chip, Button, Tabs, Tab,
  useTheme, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Divider
} from "@mui/material";

import { reportsApi, type ReportApiDto, type ReportAction } from "../../api/reportsApi";

const categoryLabel: Record<string, string> = {
  Conduct: "Conduct",
  Reliability: "Reliability",
  Payment: "Payment",
  Fraud: "Fraud",
  Spam: "Spam",
  Other: "Other",
};

const actionLabel: Record<ReportAction, string> = {
  None: "—",
  Reviewed: "Reviewed",
  Suspended: "Suspended",
  Escalated: "Escalated",
  Warned: "Warned",
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function ReportsPage() {
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [reports, setReports] = useState<ReportApiDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<ReportApiDto | null>(null);

  useEffect(() => {
    let cancelled = false;
    reportsApi.getAll()
      .then((data) => { if (!cancelled) setReports(data); })
      .catch(() => { if (!cancelled) setLoadError("Could not load reports."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const pending = useMemo(() => reports.filter((r) => r.status === "Pending"), [reports]);
  const resolved = useMemo(() => reports.filter((r) => r.status === "Resolved"), [reports]);

  const resolveWith = async (r: ReportApiDto, action: ReportAction) => {
    if (!window.confirm(`${action} this report?`)) return;
    setBusyId(r.id);
    try {
      await reportsApi.update(r.id, {
        title: r.title,
        description: r.description,
        category: r.category,
        severity: r.severity,
        status: "Resolved",
        actionTaken: action,
      });
      setReports((prev) => prev.map((x) => x.id === r.id
        ? { ...x, status: "Resolved", actionTaken: action, resolvedAt: new Date().toISOString() }
        : x
      ));
    } catch {
      setLoadError("Could not update report.");
    } finally {
      setBusyId(null);
    }
  };

  const severityDot = (s: "High" | "Medium") => (
    <Box
      sx={{
        width: 8, height: 8, borderRadius: "50%", flexShrink: 0, mt: "5px",
        bgcolor: s === "High" ? "#F87171" : "#FBBF24",
      }}
    />
  );

  const reportList = tab === 0 ? pending : resolved;

  // Stats
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of reports) counts[r.category] = (counts[r.category] ?? 0) + 1;
    return Object.entries(counts).map(([label, count]) => ({ label, count }));
  }, [reports]);

  const resolutionStats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const resolvedThisMonth = reports.filter(
      (r) => r.status === "Resolved" && r.resolvedAt && new Date(r.resolvedAt).getTime() >= monthStart
    );
    const resolvedAll = reports.filter((r) => r.status === "Resolved" && r.resolvedAt);
    let avgDays = "—";
    if (resolvedAll.length > 0) {
      const totalMs = resolvedAll.reduce((sum, r) => {
        const created = new Date(r.createdAt).getTime();
        const ended = new Date(r.resolvedAt!).getTime();
        return sum + Math.max(0, ended - created);
      }, 0);
      avgDays = (totalMs / resolvedAll.length / (1000 * 60 * 60 * 24)).toFixed(1) + " days";
    }
    const suspensions = reports.filter((r) => r.actionTaken === "Suspended").length;
    return [
      { label: "Avg resolution time", value: avgDays },
      { label: "Resolved this month", value: String(resolvedThisMonth.length) },
      { label: "Pending", value: String(pending.length), warn: pending.length > 0 },
      { label: "Actions taken", value: `${suspensions} suspensions` },
    ];
  }, [reports, pending.length]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>Reports &amp; flags</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        User-submitted reports that need moderation
      </Typography>

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
          <Tab label={`Pending (${pending.length})`} />
          <Tab label={`Resolved (${resolved.length})`} />
        </Tabs>

        {loading && (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {!loading && loadError && (
          <Box sx={{ py: 6, textAlign: "center", color: "error.main", fontSize: "0.8rem" }}>{loadError}</Box>
        )}
        {!loading && !loadError && reportList.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>
            No {tab === 0 ? "pending" : "resolved"} reports
          </Box>
        )}
        {!loading && !loadError && reportList.map((r, i) => {
          const isResolved = r.status === "Resolved";
          return (
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
              {!isResolved && severityDot(r.severity)}
              {isResolved && (
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, mt: "5px", bgcolor: "#22C55E" }} />
              )}

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" color="text.primary" fontWeight={500} sx={{ mb: 0.25 }}>
                  {r.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                  Reported by {r.reporterEmail} · {formatDate(r.createdAt)} · {categoryLabel[r.category]}
                  {isResolved && r.actionTaken !== "None" && ` · ${actionLabel[r.actionTaken]}`}
                </Typography>
              </Box>

              {isResolved ? (
                <Chip label="Resolved" size="small" color="success" variant="outlined" sx={{ fontSize: "0.65rem", height: 20, flexShrink: 0 }} />
              ) : (
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelected(r)}
                    sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
                  >
                    Review
                  </Button>
                  {(r.category === "Reliability" || r.category === "Fraud") && (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={busyId === r.id}
                      onClick={() => resolveWith(r, "Suspended")}
                      sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "error.main", color: "error.main" } }}
                    >
                      Suspend
                    </Button>
                  )}
                  {r.category === "Payment" && (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={busyId === r.id}
                      onClick={() => resolveWith(r, "Escalated")}
                      sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "warning.main", color: "warning.main" } }}
                    >
                      Escalate
                    </Button>
                  )}
                  {r.category !== "Reliability" && r.category !== "Fraud" && r.category !== "Payment" && (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={busyId === r.id}
                      onClick={() => resolveWith(r, "Warned")}
                      sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "warning.main", color: "warning.main" } }}
                    >
                      Warn user
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" fontWeight={500}>Reports by category</Typography>
          </Box>
          {categoryStats.length === 0 && (
            <Box sx={{ py: 4, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>No data</Box>
          )}
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

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="sm"
      >
        {selected && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{selected.title}</Typography>
                <Chip
                  label={selected.severity}
                  size="small"
                  color={selected.severity === "High" ? "error" : "warning"}
                  variant="outlined"
                />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                    {selected.description || "—"}
                  </Typography>
                </Box>
                <Divider />
                <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Reporter</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selected.reporterEmail}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Category</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{categoryLabel[selected.category]}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(selected.createdAt)}</Typography>
                  </Box>
                  {selected.resolvedAt && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Resolved</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(selected.resolvedAt)}</Typography>
                    </Box>
                  )}
                  {selected.actionTaken !== "None" && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">Action</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{actionLabel[selected.actionTaken]}</Typography>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
