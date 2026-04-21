import { useState } from "react";
import {
  Box, Typography, Paper, TextField, Select, MenuItem,
  Chip, Button, InputAdornment, useTheme, FormControl
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface Job {
  title: string;
  postedBy: string;
  category: string;
  date: string;
  status: "Open" | "In progress" | "Completed" | "Cancelled";
}

const MOCK_JOBS: Job[] = [
  { title: "Fix kitchen sink leak", postedBy: "maria.p", category: "Plumbing", date: "Apr 14", status: "Open" },
  { title: "Move furniture to 3rd floor", postedBy: "alex.m", category: "Moving", date: "Apr 13", status: "In progress" },
  { title: "Deep clean apartment", postedBy: "test@test.com", category: "Cleaning", date: "Apr 12", status: "In progress" },
  { title: "Install light fixtures", postedBy: "john.d", category: "Electrical", date: "Apr 10", status: "Completed" },
  { title: "Repaint living room walls", postedBy: "nina.k", category: "Painting", date: "Apr 8", status: "Cancelled" },
  { title: "Assemble IKEA wardrobe", postedBy: "maria.p", category: "Assembly", date: "Apr 7", status: "Completed" },
  { title: "Repair bathroom tiles", postedBy: "alex.m", category: "Plumbing", date: "Apr 5", status: "Open" },
  { title: "Electrical panel inspection", postedBy: "stefan.r", category: "Electrical", date: "Apr 3", status: "Completed" },
  { title: "Window cleaning (5 floors)", postedBy: "olga.p", category: "Cleaning", date: "Apr 1", status: "Open" },
];

const statusColor: Record<string, "primary" | "success" | "default" | "error"> = {
  Open: "primary",
  "In progress": "success",
  Completed: "default",
  Cancelled: "error",
};

const categories = ["All", "Plumbing", "Moving", "Cleaning", "Electrical", "Painting", "Assembly"];

export default function JobsPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = MOCK_JOBS.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.postedBy.toLowerCase().includes(search.toLowerCase());
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

      {/* Filters */}
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
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All statuses</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In progress">In progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
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
            {filtered.length === 0 && (
              <Box component="tr">
                <Box component="td" colSpan={6} sx={{ px: 2.5, py: 5, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>
                  No jobs found
                </Box>
              </Box>
            )}
            {filtered.map((job, i) => (
              <Box
                key={i}
                component="tr"
                sx={{ "&:last-child td": { borderBottom: "none" }, "&:hover td": { bgcolor: "rgba(255,255,255,0.02)" } }}
              >
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.82rem", color: "text.primary", fontWeight: 500, borderBottom: `1px solid ${theme.palette.divider}`, maxWidth: 220 }}>
                  {job.title}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {job.postedBy}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {job.category}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {job.date}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Chip label={job.status} size="small" color={statusColor[job.status]} variant="outlined" sx={{ fontSize: "0.65rem", height: 20 }} />
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Button
                    size="small"
                    variant="outlined"
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
    </Box>
  );
}
