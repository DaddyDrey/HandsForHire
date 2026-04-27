import { useEffect, useState } from "react";
import {
  Box, Typography, Paper, TextField, Select, MenuItem,
  Chip, Button, InputAdornment, useTheme, FormControl,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Divider
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useAnnouncementService, type Announcement, type AnnouncementStatus } from "../../mock_data/announcements";

const statusLabel: Record<AnnouncementStatus, string> = {
  Open: "Open",
  InProgress: "In progress",
  Completed: "Completed",
  Cancelled: "Cancelled",
  Paused: "Paused",
};

const statusColor: Record<AnnouncementStatus, "primary" | "success" | "default" | "error" | "warning"> = {
  Open: "primary",
  InProgress: "success",
  Completed: "default",
  Cancelled: "error",
  Paused: "warning",
};

const STATUS_OPTIONS: ("All" | AnnouncementStatus)[] = [
  "All", "Open", "InProgress", "Completed", "Cancelled", "Paused",
];

const categories = ["All", "Plumbing", "Moving", "Cleaning", "Electrical", "Painting", "Assembly", "HVAC", "Handyman", "Other"];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function JobsPage() {
  const theme = useTheme();
  const { getAll } = useAnnouncementService();

  const [jobs, setJobs] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<"All" | AnnouncementStatus>("All");
  const [selectedJob, setSelectedJob] = useState<Announcement | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAll()
      .then((data) => {
        if (cancelled) return;
        setJobs(data);
        setError(null);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load jobs.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [getAll]);

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.authorEmail ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (j.authorName ?? "").toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || j.category === categoryFilter;
    const matchStatus = statusFilter === "All" || j.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>Job listings</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        All posted jobs and their current state
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search by title or user…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 16, color: "text.disabled" }} /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => <MenuItem key={c} value={c}>{c === "All" ? "All categories" : c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "All" | AnnouncementStatus)}>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {s === "All" ? "All statuses" : statusLabel[s]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead">
            <Box component="tr">
              {["Title", "Posted by", "Category", "Date", "Status", ""].map((h) => (
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
            {loading && (
              <Box component="tr">
                <Box component="td" colSpan={6} sx={{ px: 2.5, py: 5, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>
                  Loading…
                </Box>
              </Box>
            )}
            {!loading && error && (
              <Box component="tr">
                <Box component="td" colSpan={6} sx={{ px: 2.5, py: 5, textAlign: "center", color: "error.main", fontSize: "0.8rem" }}>
                  {error}
                </Box>
              </Box>
            )}
            {!loading && !error && filtered.length === 0 && (
              <Box component="tr">
                <Box component="td" colSpan={6} sx={{ px: 2.5, py: 5, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>
                  No jobs found
                </Box>
              </Box>
            )}
            {!loading && !error && filtered.map((job) => (
              <Box
                key={job.id}
                component="tr"
                sx={{ "&:last-child td": { borderBottom: "none" }, "&:hover td": { bgcolor: "rgba(255,255,255,0.02)" } }}
              >
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.82rem", color: "text.primary", fontWeight: 500, borderBottom: `1px solid ${theme.palette.divider}`, maxWidth: 220 }}>
                  {job.title}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {job.authorName || job.authorEmail || `user#${job.userId}`}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {job.category}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {formatDate(job.createdAt)}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Chip label={statusLabel[job.status]} size="small" color={statusColor[job.status]} variant="outlined" sx={{ fontSize: "0.65rem", height: 20 }} />
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setSelectedJob(job)}
                    sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      <Dialog
        open={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedJob && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedJob.title}</Typography>
                <Chip
                  label={statusLabel[selectedJob.status]}
                  size="small"
                  color={statusColor[selectedJob.status]}
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
                    {selectedJob.description || "—"}
                  </Typography>
                </Box>
                <Divider />
                <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Posted by</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {selectedJob.authorName || selectedJob.authorEmail || `user#${selectedJob.userId}`}
                    </Typography>
                    {selectedJob.authorEmail && selectedJob.authorName && (
                      <Typography variant="caption" color="text.secondary">{selectedJob.authorEmail}</Typography>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Category</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedJob.category}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">City</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedJob.city || "—"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Created</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(selectedJob.createdAt)}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Updated</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatDate(selectedJob.updatedAt)}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedJob(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
