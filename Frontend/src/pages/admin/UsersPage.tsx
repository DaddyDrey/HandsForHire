import { useEffect, useState } from "react";
import {
  Box, Typography, Paper, TextField, Select, MenuItem,
  Chip, Button, InputAdornment, useTheme, FormControl, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Divider, Avatar
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { messagesApi, type UserApiDto } from "../../api/messagesApi";

const ADMIN_EMAILS = ["demo@handsforhire.com"];

type Row = {
  id: number;
  email: string;
  fullName: string;
  status: "Active" | "Suspended" | "Pending" | "Demo";
  role: "Admin" | "User";
  isAdmin: boolean;
};

const statusColor: Record<string, "success" | "error" | "warning" | "primary" | "default"> = {
  Active: "success",
  Suspended: "error",
  Pending: "warning",
  Demo: "primary",
};

function mapUser(u: UserApiDto): Row {
  const isAdmin = ADMIN_EMAILS.includes(u.email.toLowerCase());
  let status: Row["status"];
  if (isAdmin) status = "Demo";
  else status = u.status === "Suspended" ? "Suspended" : "Active";
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    status,
    role: isAdmin ? "Admin" : "User",
    isAdmin,
  };
}

function initials(name: string, fallback: string): string {
  const trimmed = name.trim();
  if (!trimmed) return fallback[0]?.toUpperCase() ?? "?";
  return trimmed.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join("");
}

export default function UsersPage() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [users, setUsers] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Row | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const toggleStatus = async (user: Row) => {
    if (user.isAdmin) return;
    const next = user.status === "Suspended" ? "Active" : "Suspended";
    setBusyId(user.id);
    try {
      await messagesApi.setUserStatus(user.id, next);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: next } : u));
    } catch {
      setLoadError("Could not update user status.");
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    messagesApi.getAllUsers()
      .then((data) => {
        if (cancelled) return;
        setUsers(data.map(mapUser));
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError("Could not load users from the server.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = users.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>Users</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Manage registered accounts
      </Typography>

      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder="Search by email or name…"
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

      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead">
            <Box component="tr">
              {["Email", "Name", "Status", "Role", ""].map((h) => (
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
                <Box component="td" colSpan={5} sx={{ px: 2.5, py: 5, textAlign: "center" }}>
                  <CircularProgress size={20} />
                </Box>
              </Box>
            )}
            {!loading && loadError && (
              <Box component="tr">
                <Box component="td" colSpan={5} sx={{ px: 2.5, py: 5, textAlign: "center", color: "error.main", fontSize: "0.8rem" }}>
                  {loadError}
                </Box>
              </Box>
            )}
            {!loading && !loadError && filtered.length === 0 && (
              <Box component="tr">
                <Box component="td" colSpan={5} sx={{ px: 2.5, py: 5, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>
                  No users found
                </Box>
              </Box>
            )}
            {!loading && !loadError && filtered.map((user) => (
              <Box
                key={user.id}
                component="tr"
                sx={{ "&:last-child td": { borderBottom: "none" }, "&:hover td": { bgcolor: "rgba(255,255,255,0.02)" } }}
              >
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.82rem", color: "text.primary", fontWeight: 500, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {user.email}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {user.fullName || "—"}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Chip label={user.status} size="small" color={statusColor[user.status]} variant="outlined" sx={{ fontSize: "0.65rem", height: 20 }} />
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, fontSize: "0.8rem", color: "text.secondary", borderBottom: `1px solid ${theme.palette.divider}` }}>
                  {user.role}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedUser(user)}
                      sx={{ fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
                    >
                      View
                    </Button>
                    {!user.isAdmin && (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={busyId === user.id}
                        onClick={() => toggleStatus(user)}
                        sx={{
                          fontSize: "0.7rem", py: 0.25, px: 1.25, minWidth: 0,
                          borderColor: "divider", color: "text.secondary",
                          "&:hover": user.status === "Suspended"
                            ? { borderColor: "success.main", color: "success.main" }
                            : { borderColor: "error.main", color: "error.main" },
                        }}
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

      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedUser && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ width: 48, height: 48, bgcolor: "rgba(124,92,255,0.18)", color: "primary.main", fontWeight: 700 }}>
                  {initials(selectedUser.fullName, selectedUser.email)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                    {selectedUser.fullName || selectedUser.email}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={selectedUser.status}
                      size="small"
                      color={statusColor[selectedUser.status]}
                      variant="outlined"
                      sx={{ fontSize: "0.65rem", height: 20 }}
                    />
                    <Chip
                      label={selectedUser.role}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.65rem", height: 20 }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Email
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                    {selectedUser.email}
                  </Typography>
                </Box>
                <Divider />
                <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">User ID</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>#{selectedUser.id}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Full name</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedUser.fullName || "—"}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Status</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedUser.status}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Role</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedUser.role}</Typography>
                  </Box>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedUser(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
