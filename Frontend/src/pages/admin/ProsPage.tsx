import { useState } from "react";
import {
  Box, Typography, Paper, TextField, Select, MenuItem,
  Chip, Button, InputAdornment, Avatar, useTheme, FormControl
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface Pro {
  name: string;
  email: string;
  category: string;
  city: string;
  rating: number;
  reviews: number;
  status: "Verified" | "Pending review" | "Suspended";
}

const MOCK_PROS: Pro[] = [
  { name: "Stefan Rusu", email: "stefan.r@email.com", category: "Plumbing", city: "Chișinău", rating: 4.9, reviews: 42, status: "Verified" },
  { name: "Ana Vîntu", email: "ana.v@email.com", category: "Cleaning", city: "Chișinău", rating: 4.3, reviews: 28, status: "Verified" },
  { name: "Mihai Dinu", email: "mihai.d@email.com", category: "Electrical", city: "Bălți", rating: 3.8, reviews: 11, status: "Pending review" },
  { name: "Olga Popa", email: "olga.p@email.com", category: "Moving", city: "Chișinău", rating: 4.1, reviews: 19, status: "Pending review" },
  { name: "Vasile Balan", email: "vasile.b@email.com", category: "Plumbing", city: "Cahul", rating: 2.1, reviews: 7, status: "Suspended" },
  { name: "Irina Ciobanu", email: "irina.c@email.com", category: "Painting", city: "Chișinău", rating: 4.7, reviews: 33, status: "Verified" },
];

const statusColor: Record<string, "success" | "warning" | "error"> = {
  Verified: "success",
  "Pending review": "warning",
  Suspended: "error",
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

function RatingStars({ value }: { value: number }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <StarRoundedIcon key={i} sx={{ fontSize: 14, color: i <= Math.round(value) ? "#FBBF24" : "rgba(255,255,255,0.12)" }} />
      ))}
      <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5, fontSize: "0.72rem" }}>
        {value.toFixed(1)}
      </Typography>
    </Box>
  );
}

export default function ProsPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(MOCK_PROS.map((p) => p.category)))];

  const filtered = MOCK_PROS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>Service providers</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage pro accounts and verifications
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search pros…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 16, color: "text.disabled" }} /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 180 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => <MenuItem key={c} value={c}>{c === "All" ? "All categories" : c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All statuses</MenuItem>
            <MenuItem value="Verified">Verified</MenuItem>
            <MenuItem value="Pending review">Pending review</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
        {filtered.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>No pros found</Box>
        )}
        {filtered.map((pro, i) => (
          <Box
            key={pro.email}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 2.5,
              py: 1.75,
              borderBottom: i < filtered.length - 1 ? `1px solid ${theme.palette.divider}` : "none",
              "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "rgba(124,92,255,0.15)",
                color: "primary.main",
                fontSize: "0.78rem",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {initials(pro.name)}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {pro.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.72rem" }}>
                {pro.category} · {pro.city} · {pro.reviews} reviews
              </Typography>
              <Box mt={0.25}>
                <RatingStars value={pro.rating} />
              </Box>
            </Box>

            <Chip
              label={pro.status}
              size="small"
              color={statusColor[pro.status]}
              variant="outlined"
              sx={{ fontSize: "0.65rem", height: 20, flexShrink: 0 }}
            />

            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Button
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.7rem", py: 0.25, px: 1.5, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
              >
                {pro.status === "Pending review" ? "Review" : "View"}
              </Button>
              {pro.status !== "Suspended" && (
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem", py: 0.25, px: 1.5, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "error.main", color: "error.main" } }}
                >
                  Suspend
                </Button>
              )}
              {pro.status === "Suspended" && (
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem", py: 0.25, px: 1.5, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "success.main", color: "success.main" } }}
                >
                  Restore
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
