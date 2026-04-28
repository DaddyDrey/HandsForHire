import { useEffect, useMemo, useState } from "react";
import { Box, Typography, Paper, Chip, useTheme, CircularProgress } from "@mui/material";
import type { ChipProps } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

import { messagesApi } from "../../api/messagesApi";
import { prosApi } from "../../api/prosApi";
import { useAnnouncementService, type Announcement, type AnnouncementStatus } from "../../mock_data/announcements";
import { useLanguage } from "../../translations/useLanguage";

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

function useStatusLabel(): Record<AnnouncementStatus, string> {
  const { t } = useLanguage();
  return {
    Open: t("statusOpen"),
    InProgress: t("statusInProgress"),
    Completed: t("statusCompleted"),
    Cancelled: t("statusCancelled"),
    Paused: t("statusPaused"),
  };
}

const STATUS_COLOR: Record<AnnouncementStatus, string> = {
  Open: "#7C5CFF",
  InProgress: "#22C55E",
  Completed: "#5A6278",
  Cancelled: "#F87171",
  Paused: "#FBBF24",
};

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const theme = useTheme();
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 110, px: 1, pt: 1 }}>
      {data.map((d) => (
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

function DonutChart({ data, emptyDonutLabel }: { data: { label: string; pct: number; color: string }[]; emptyDonutLabel: string }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const segments = data.map((d, index) => {
    const previousPct = data.slice(0, index).reduce((total, item) => total + item.pct, 0);
    return {
      ...d,
      dash: (d.pct / 100) * circ,
      offset: (previousPct / 100) * circ,
    };
  });

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 3, p: 2 }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        {data.length === 0 ? (
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="14" />
        ) : (
          segments.map((d) => (
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
          ))
        )}
      </svg>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
        {data.length === 0 ? (
          <Typography variant="caption" color="text.disabled" sx={{ fontSize: "0.72rem" }}>
            {emptyDonutLabel}
          </Typography>
        ) : (
          data.map((d) => (
            <Box key={d.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: d.color, flexShrink: 0 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                {d.label} — {d.pct}%
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

type ActivityRow = {
  event: string;
  user: string;
  time: string;
  status: string;
  color: ChipProps["color"];
};

function relativeTime(iso: string, t: (k: "justNow" | "minutesAgo" | "hoursAgo" | "daysAgo") => string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("justNow");
  if (mins < 60) return t("minutesAgo").replace("{n}", String(mins));
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("hoursAgo").replace("{n}", String(hours));
  const days = Math.floor(hours / 24);
  if (days < 7) return t("daysAgo").replace("{n}", String(days));
  return iso.slice(0, 10);
}

function useStatusChip() {
  const { t } = useLanguage();
  return (status: AnnouncementStatus): { status: string; color: ChipProps["color"] } => {
    switch (status) {
      case "Open": return { status: t("statusLive"), color: "primary" };
      case "InProgress": return { status: t("statusInProgress"), color: "success" };
      case "Completed": return { status: t("statusCompleted"), color: "default" };
      case "Cancelled": return { status: t("statusCancelled"), color: "error" };
      case "Paused": return { status: t("statusPaused"), color: "warning" };
    }
  };
}

const LANG_TO_LOCALE: Record<string, string> = { en: "en-US", ro: "ro-RO", ru: "ru-RU" };

export default function DashboardPage() {
  const theme = useTheme();
  const { t, language } = useLanguage();
  const locale = LANG_TO_LOCALE[language] ?? "en-US";
  const STATUS_LABEL = useStatusLabel();
  const statusChip = useStatusChip();
  const { getAll: getAllAnnouncements } = useAnnouncementService();

  const [usersCount, setUsersCount] = useState<number | null>(null);
  const [prosCount, setProsCount] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      messagesApi.getAllUsers().catch(() => []),
      prosApi.getAll().catch(() => []),
      getAllAnnouncements().catch(() => []),
    ]).then(([users, pros, jobs]) => {
      if (cancelled) return;
      setUsersCount(users.length);
      setProsCount(pros.length);
      setAnnouncements(jobs);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [getAllAnnouncements]);

  const openJobsCount = useMemo(
    () => (announcements ?? []).filter((a) => a.status === "Open").length,
    [announcements]
  );

  const openJobsThisWeek = useMemo(() => {
    if (!announcements) return 0;
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    return announcements.filter((a) => a.status === "Open" && new Date(a.createdAt).getTime() > weekAgo).length;
  }, [announcements]);

  const monthlyJobs = useMemo(() => {
    if (!announcements) return [];
    const months: { label: string; key: string; value: number }[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleString(locale, { month: "short" });
      months.push({ label, key, value: 0 });
    }
    for (const a of announcements) {
      const d = new Date(a.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const m = months.find((x) => x.key === key);
      if (m) m.value++;
    }
    return months.map((m) => ({ label: m.label, value: m.value }));
  }, [announcements, locale]);

  const donutData = useMemo(() => {
    if (!announcements || announcements.length === 0) return [];
    const counts: Record<AnnouncementStatus, number> = {
      Open: 0, InProgress: 0, Completed: 0, Cancelled: 0, Paused: 0,
    };
    for (const a of announcements) counts[a.status]++;
    const total = announcements.length;
    return (Object.keys(counts) as AnnouncementStatus[])
      .filter((k) => counts[k] > 0)
      .map((k) => ({
        label: STATUS_LABEL[k],
        pct: Math.round((counts[k] / total) * 100),
        color: STATUS_COLOR[k],
      }));
  }, [announcements]);

  const activity: ActivityRow[] = useMemo(() => {
    if (!announcements) return [];
    const sorted = [...announcements].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sorted.slice(0, 5).map((a) => {
      const c = statusChip(a.status);
      return {
        event: t("jobPostedActivity").replace("{title}", a.title),
        user: a.authorName || a.authorEmail || `user#${a.userId}`,
        time: relativeTime(a.createdAt, t),
        status: c.status,
        color: c.color,
      };
    });
  }, [announcements, statusChip, t]);

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>{t("dashboardTitle")}</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t("dashboardSubtitle")}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 1.5, mb: 3 }}>
            <MetricCard
              label={t("totalUsers")}
              value={String(usersCount ?? 0)}
              accent
            />
            <MetricCard
              label={t("activePros")}
              value={String(prosCount ?? 0)}
            />
            <MetricCard
              label={t("openJobsCard")}
              value={String(openJobsCount)}
              delta={openJobsThisWeek > 0 ? t("thisWeekDelta").replace("{n}", String(openJobsThisWeek)) : undefined}
              deltaType="up"
            />
            <MetricCard
              label={t("pendingReportsCard")}
              value="0"
              delta={t("needsAttention")}
              deltaType="warn"
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" }, gap: 2, mb: 3 }}>
            <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" fontWeight={500}>{t("jobPostingsLast8")}</Typography>
              </Box>
              <BarChart data={monthlyJobs} />
            </Paper>
            <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
              <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Typography variant="body2" fontWeight={500}>{t("jobListingsStatus")}</Typography>
              </Box>
              <DonutChart data={donutData} emptyDonutLabel={t("noJobsYet")} />
            </Paper>
          </Box>

          <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ px: 2.5, py: 1.75, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="body2" fontWeight={500}>{t("recentActivity")}</Typography>
            </Box>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <Box component="thead">
                <Box component="tr">
                  {[t("eventField"), t("userField"), t("timeField"), t("statusField")].map((h) => (
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
                {activity.length === 0 && (
                  <Box component="tr">
                    <Box component="td" colSpan={4} sx={{ px: 2.5, py: 5, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>
                      {t("noActivity")}
                    </Box>
                  </Box>
                )}
                {activity.map((row, i) => (
                  <Box
                    key={i}
                    component="tr"
                    sx={{ "&:hover td": { bgcolor: "rgba(255,255,255,0.02)" }, "&:last-child td": { borderBottom: "none" } }}
                  >
                    <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}`, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
        </>
      )}
    </Box>
  );
}
