import { useState } from "react";
import {
  Box, Typography, Paper, TextField, Select, MenuItem,
  Chip, Button, InputAdornment, useTheme, FormControl
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface User {
  email: string;
  joined: string;
  status: "Active" | "Suspended" | "Pending" | "Demo";
  role: "Admin" | "User";
}

const MOCK_USERS: User[] = [
  { email: "demo@handsforhire.com", joined: "Jan 2025", status: "Demo", role: "Admin" },
  { email: "alex.m@email.com", joined: "Apr 2025", status: "Active", role: "User" },
  { email: "maria.p@email.com", joined: "Mar 2025", status: "Active", role: "User" },
  { email: "john.d@email.com", joined: "Feb 2025", status: "Pending", role: "User" },
  { email: "nina.k@email.com", joined: "Jan 2025", status: "Suspended", role: "User" },
  { email: "test@test.com", joined: "Dec 2024", status: "Active", role: "User" },
  { email: "stefan.r@email.com", joined: "Nov 2024", status: "Active", role: "User" },
  { email: "olga.p@email.com", joined: "Oct 2024", status: "Pending", role: "User" },
];

const statusColor: Record<string, "success" | "error" | "warning" | "primary" | "default"> = {
  Active: "success",
  Suspended: "error",
  Pending: "warning",
  Demo: "primary",
};

export default function UsersPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = MOCK_USERS.filter((u) => {
    const matchSearch = u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>Users</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage registered accounts
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search by email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 16, color: "text.disabled" }} /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 200 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All statuses</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Suspended">Suspended</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead">
            <Box component="tr">
              {["Email", "Joined", "Status", "Role", ""].map((h) => (
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
                <Box component="td" colSpan={5} sx={{ px: 2.5, py: 5, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>
                  No users found
                </Box>
              </Box>
            )}
            {filtered.map((user) => (
              <Box
                key={user.email}
                component="tr"
                sx={{ "&:last-child td": { borderBottom: "none" }, "&:hover td": { bgcolor: "rgba(255,255,255,0.02)" } }}
              >
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.82rem", color: "text.primary", fontWeight: 500, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {user.email}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {user.joined}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Chip label={user.status} size="small" color={statusColor[user.status]} variant="outlined" sx={{ fontSize: "0.65rem", height: 20 }} />
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {user.role}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" variant="outlined" sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}>
                      View
                    </Button>
                    {user.status !== "Demo" && (
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "error.main", color: "error.main" } }}
                      >
                        {user.status === "Suspended" ? "Restore" : "Suspend"}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
