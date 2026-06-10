import { useEffect, useMemo, useState } from "react";
import {
  Box, Typography, Paper, Chip, Button, Tabs, Tab,
  useTheme, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Divider
} from "@mui/material";

import { reportsApi, type ReportApiDto, type ReportAction } from "../../api/reportsApi";
import { messagesApi, type UserApiDto } from "../../api/messagesApi";
import { prosApi, type ProApiDto } from "../../api/prosApi";
import { useLanguage } from "../../translations/useLanguage";

function useCategoryLabel(): Record<string, string> {
  const { t } = useLanguage();
  return {
    Conduct: t("catConduct"),
    Reliability: t("catReliability"),
    Payment: t("catPayment"),
    Fraud: t("catFraud"),
    Spam: t("catSpam"),
    Other: t("catOther"),
  };
}

function useActionLabel(): Record<ReportAction, string> {
  const { t } = useLanguage();
  return {
    None: "вЂ”",
    Reviewed: t("actReviewed"),
    Suspended: t("actSuspended"),
    Escalated: t("actEscalated"),
    Warned: t("actWarned"),
  };
}

const LANG_TO_LOCALE: Record<string, string> = { en: "en-US", ro: "ro-RO", ru: "ru-RU" };

function formatDate(iso: string, locale: string): string {
  try {
    return new Date(iso).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function ReportsPage() {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const locale = LANG_TO_LOCALE[language] ?? "en-US";
  const categoryLabel = useCategoryLabel();
  const actionLabel = useActionLabel();
  const [tab, setTab] = useState(0);
  const [reports, setReports] = useState<ReportApiDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selected, setSelected] = useState<ReportApiDto | null>(null);
  const [users, setUsers] = useState<UserApiDto[]>([]);
  const [pros, setPros] = useState<ProApiDto[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      reportsApi.getAll(),
      messagesApi.getAllUsers().catch(() => [] as UserApiDto[]),
      prosApi.getAll().catch(() => [] as ProApiDto[]),
    ])
      .then(([reportsData, usersData, prosData]) => {
        if (cancelled) return;
        setReports(reportsData);
        setUsers(usersData);
        setPros(prosData);
      })
      .catch(() => { if (!cancelled) setLoadError(t("couldNotLoadReports")); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const pending = useMemo(() => reports.filter((r) => r.status === "Pending"), [reports]);
  const resolved = useMemo(() => reports.filter((r) => r.status === "Resolved"), [reports]);

  const resolveWith = async (r: ReportApiDto, action: ReportAction) => {
    if (!window.confirm(t("confirmActionPhrase").replace("{action}", action))) return;
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
      const targetEmail = getReportTargetEmail(r);
      if (targetEmail) {
        const target = targetEmail.toLowerCase();
        setUsers((prev) => prev.map((u) => {
          if (u.email.toLowerCase() !== target) return u;
          if (action === "Warned") return { ...u, warningCount: u.warningCount + 1 };
          if (action === "Suspended") return { ...u, status: "Suspended" };
          return u;
        }));
      }
    } catch {
      setLoadError(t("couldNotUpdateReport"));
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

  const getTargetUser = (email: string) => {
    const normalized = email.toLowerCase();
    return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
  };

  const deleteReport = async (r: ReportApiDto) => {
    if (!window.confirm(t("confirmDeleteReport"))) return;
    setBusyId(r.id);
    try {
      await reportsApi.delete(r.id);
      setReports((prev) => prev.filter((x) => x.id !== r.id));
      if (selected?.id === r.id) setSelected(null);
    } catch {
      setLoadError(t("couldNotUpdateReport"));
    } finally {
      setBusyId(null);
    }
  };

  const inferTargetEmail = (r: ReportApiDto) => {
    const haystack = `${r.title} ${r.description}`;
    const emails = haystack.match(/[^\s<>()[\],;:]+@[^\s<>()[\],;:]+\.[^\s<>()[\],;:.]+/g) ?? [];
    const reporter = r.reporterEmail.toLowerCase();
    const emailMatch = emails.find((email) => email.toLowerCase() !== reporter);
    if (emailMatch) return emailMatch;

    const name = extractReportedName(r);
    if (!name) return "";

    const normalizedName = normalizeName(name);
    const userMatch = users.find((u) =>
      normalizeName(u.fullName) === normalizedName ||
      normalizeName(u.email.split("@")[0]) === normalizedName
    );
    if (userMatch) return userMatch.email;

    const proMatch = pros.find((p) =>
      normalizeName(p.fullName) === normalizedName ||
      normalizeName(p.email.split("@")[0]) === normalizedName
    );
    return proMatch?.email ?? "";
  };

  const getReportTargetEmail = (r: ReportApiDto) => r.targetEmail || inferTargetEmail(r);

  const normalizeName = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");

  const extractReportedName = (r: ReportApiDto) => {
    const match = r.title.match(/\bwith\s+(.+)$/i);
    return match?.[1]?.trim() ?? "";
  };

  const renderTargetInfo = (r: ReportApiDto) => {
    const targetEmail = getReportTargetEmail(r);
    if (!targetEmail) return t("noTargetUser");
    const target = getTargetUser(targetEmail);
    const warnings = target?.warningCount ?? 0;
    return `${targetEmail} · ${t("warningsCount").replace("{n}", String(warnings))}`;
  };

  // Stats
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of reports) counts[r.category] = (counts[r.category] ?? 0) + 1;
    return Object.entries(counts).map(([label, count]) => ({ label: categoryLabel[label] ?? label, count }));
  }, [reports, categoryLabel]);

  const resolutionStats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const resolvedThisMonth = reports.filter(
      (r) => r.status === "Resolved" && r.resolvedAt && new Date(r.resolvedAt).getTime() >= monthStart
    );
    const resolvedAll = reports.filter((r) => r.status === "Resolved" && r.resolvedAt);
    let avgDays = "вЂ”";
    if (resolvedAll.length > 0) {
      const totalMs = resolvedAll.reduce((sum, r) => {
        const created = new Date(r.createdAt).getTime();
        const ended = new Date(r.resolvedAt!).getTime();
        return sum + Math.max(0, ended - created);
      }, 0);
      const days = (totalMs / resolvedAll.length / (1000 * 60 * 60 * 24)).toFixed(1);
      avgDays = t("nDaysSuffix").replace("{n}", days);
    }
    const suspensions = reports.filter((r) => r.actionTaken === "Suspended").length;
    return [
      { label: t("avgResolutionTime"), value: avgDays },
      { label: t("resolvedThisMonth"), value: String(resolvedThisMonth.length) },
      { label: t("statusPending"), value: String(pending.length), warn: pending.length > 0 },
      { label: t("actionsTaken"), value: t("suspensionsCount").replace("{n}", String(suspensions)) },
    ];
  }, [reports, pending.length, t]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>{t("reportsPageTitle")}</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t("reportsPageSubtitle")}
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
          <Tab label={t("pendingTab").replace("{n}", String(pending.length))} />
          <Tab label={t("resolvedTab").replace("{n}", String(resolved.length))} />
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
            {tab === 0 ? t("noPendingReports") : t("noResolvedReports")}
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
                  {t("reportedByPhrase")} {r.reporterEmail} В· {formatDate(r.createdAt, locale)} В· {categoryLabel[r.category]}
                  {isResolved && r.actionTaken !== "None" && ` В· ${actionLabel[r.actionTaken]}`}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", fontSize: "0.72rem", mt: 0.25 }}>
                  {t("targetUserField")}: {renderTargetInfo(r)}
                </Typography>
              </Box>

              {isResolved ? (
                <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                  <Chip label={t("statusResolved")} size="small" color="success" variant="outlined" sx={{ fontSize: "0.65rem", height: 20, flexShrink: 0 }} />
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={busyId === r.id}
                    onClick={() => deleteReport(r)}
                    sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0 }}
                  >
                    {t("deleteReportBtn")}
                  </Button>
                </Stack>
              ) : (
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelected(r)}
                    sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
                  >
                    {t("reviewBtn")}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={busyId === r.id}
                    onClick={() => resolveWith(r, "Reviewed")}
                    sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "success.main", color: "success.main" } }}
                  >
                    {t("markReviewedBtn")}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={busyId === r.id || !getReportTargetEmail(r)}
                    onClick={() => resolveWith(r, "Suspended")}
                    sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "error.main", color: "error.main" } }}
                  >
                    {t("suspendBtn")}
                  </Button>
                  {r.category === "Payment" && (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={busyId === r.id}
                      onClick={() => resolveWith(r, "Escalated")}
                      sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "warning.main", color: "warning.main" } }}
                    >
                      {t("escalateBtn")}
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    disabled={busyId === r.id || !getReportTargetEmail(r)}
                    onClick={() => resolveWith(r, "Warned")}
                    sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "warning.main", color: "warning.main" } }}
                  >
                    {t("warnUserBtn")}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={busyId === r.id}
                    onClick={() => deleteReport(r)}
                    sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0 }}
                  >
                    {t("deleteReportBtn")}
                  </Button>
                </Box>
              )}
            </Box>
          );
        })}
      </Paper>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
        <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="body2" fontWeight={500}>{t("reportsByCategory")}</Typography>
          </Box>
          {categoryStats.length === 0 && (
            <Box sx={{ py: 4, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>{t("noDataLabel")}</Box>
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
            <Typography variant="body2" fontWeight={500}>{t("resolutionStats")}</Typography>
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
                  label={selected.severity === "High" ? t("sevHigh") : t("sevMedium")}
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
                    {t("descriptionField")}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                    {selected.description || "вЂ”"}
                  </Typography>
                </Box>
                <Divider />
                <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("reporterField")}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selected.reporterEmail}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("targetUserField")}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{renderTargetInfo(selected)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("categoryField")}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{categoryLabel[selected.category]}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("createdAtField")}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(selected.createdAt, locale)}</Typography>
                  </Box>
                  {selected.resolvedAt && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t("resolvedAtField")}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(selected.resolvedAt, locale)}</Typography>
                    </Box>
                  )}
                  {selected.actionTaken !== "None" && (
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t("actionField")}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{actionLabel[selected.actionTaken]}</Typography>
                    </Box>
                  )}
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelected(null)}>{t("closeBtn")}</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
