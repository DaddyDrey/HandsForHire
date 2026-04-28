import { useEffect, useState } from "react";
import {
  Box, Typography, Paper, TextField, Select, MenuItem,
  Chip, Button, InputAdornment, Avatar, useTheme, FormControl, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack, Divider
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { prosApi, type ProStatus } from "../../api/prosApi";
import { reviewsApi, type ReviewApiDto } from "../../api/reviewsApi";
import { useLanguage } from "../../translations/useLanguage";

interface Pro {
  id: number;
  name: string;
  email: string;
  category: string;
  city: string;
  hourlyRate: number;
  rating: number;
  reviews: number;
  status: ProStatus;
}

function useStatusLabels(): Record<ProStatus, string> {
  const { t } = useLanguage();
  return {
    Pending: t("statusPendingReview"),
    Verified: t("statusVerified"),
    Suspended: t("statusSuspended"),
  };
}

const statusColor: Record<ProStatus, "success" | "warning" | "error"> = {
  Verified: "success",
  Pending: "warning",
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
  const { t } = useLanguage();
  const statusLabel = useStatusLabels();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pros, setPros] = useState<Pro[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedPro, setSelectedPro] = useState<Pro | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const setStatus = async (pro: Pro, next: ProStatus) => {
    setBusyId(pro.id);
    try {
      await prosApi.setStatus(pro.id, next);
      setPros((prev) => prev.map((p) => p.id === pro.id ? { ...p, status: next } : p));
    } catch {
      setLoadError(t("couldNotUpdatePro"));
    } finally {
      setBusyId(null);
    }
  };

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      prosApi.getAll(),
      reviewsApi.getAll().catch(() => [] as ReviewApiDto[]),
    ])
      .then(([prosData, reviewsData]) => {
        if (cancelled) return;
        setPros(prosData.map((p) => {
          const proReviews = reviewsData.filter((r) => r.proId === p.id);
          const avgRating = proReviews.length > 0
            ? proReviews.reduce((acc, r) => acc + r.rating, 0) / proReviews.length
            : 0;
          return {
            id: p.id,
            name: p.fullName,
            email: p.email,
            category: p.trade,
            city: p.city,
            hourlyRate: p.hourlyRate,
            rating: avgRating,
            reviews: proReviews.length,
            status: p.status,
          };
        }));
      })
      .catch(() => {
        if (cancelled) return;
        setLoadError(t("couldNotLoadPros"));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const categories = ["All", ...Array.from(new Set(pros.map((p) => p.category)))];

  const filtered = pros.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    const matchStatus = statusFilter === "All" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <Box>
      <Typography variant="h5" fontWeight={500} gutterBottom>{t("prosPageTitle")}</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        {t("prosPageSubtitle")}
      </Typography>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 2, flexWrap: "wrap" }}>
        <TextField
          size="small"
          placeholder={t("searchProsPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 16, color: "text.disabled" }} /></InputAdornment> }}
          sx={{ flex: 1, minWidth: 180 }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((c) => <MenuItem key={c} value={c}>{c === "All" ? t("allCategoriesFilter") : c}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">{t("allStatuses")}</MenuItem>
            <MenuItem value="Verified">{t("statusVerified")}</MenuItem>
            <MenuItem value="Pending">{t("statusPendingReview")}</MenuItem>
            <MenuItem value="Suspended">{t("statusSuspended")}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Paper elevation={0} sx={{ bgcolor: "background.paper", border: `1px solid ${theme.palette.divider}`, borderRadius: 2, overflow: "hidden" }}>
        {loading && (
          <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {!loading && loadError && (
          <Box sx={{ py: 6, textAlign: "center", color: "error.main", fontSize: "0.8rem" }}>{loadError}</Box>
        )}
        {!loading && !loadError && filtered.length === 0 && (
          <Box sx={{ py: 6, textAlign: "center", color: "text.disabled", fontSize: "0.8rem" }}>{t("noProsFound")}</Box>
        )}
        {!loading && !loadError && filtered.map((pro, i) => (
          <Box
            key={pro.id}
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
                {pro.category} · {pro.city} · {pro.reviews} {t("reviewsField").toLowerCase()}
              </Typography>
              <Box mt={0.25}>
                <RatingStars value={pro.rating} />
              </Box>
            </Box>

            <Chip
              label={statusLabel[pro.status]}
              size="small"
              color={statusColor[pro.status]}
              variant="outlined"
              sx={{ fontSize: "0.65rem", height: 20, flexShrink: 0 }}
            />

            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setSelectedPro(pro)}
                sx={{ fontSize: "0.7rem", py: 0.25, px: 1.5, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "primary.main", color: "primary.main" } }}
              >
                {pro.status === "Pending" ? t("reviewBtn") : t("viewBtn")}
              </Button>
              {pro.status === "Pending" && (
                <Button
                  size="small"
                  variant="outlined"
                  disabled={busyId === pro.id}
                  onClick={() => setStatus(pro, "Verified")}
                  sx={{ fontSize: "0.7rem", py: 0.25, px: 1.5, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "success.main", color: "success.main" } }}
                >
                  {t("verifyBtn")}
                </Button>
              )}
              {pro.status !== "Suspended" && (
                <Button
                  size="small"
                  variant="outlined"
                  disabled={busyId === pro.id}
                  onClick={() => setStatus(pro, "Suspended")}
                  sx={{ fontSize: "0.7rem", py: 0.25, px: 1.5, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "error.main", color: "error.main" } }}
                >
                  {t("suspendBtn")}
                </Button>
              )}
              {pro.status === "Suspended" && (
                <Button
                  size="small"
                  variant="outlined"
                  disabled={busyId === pro.id}
                  onClick={() => setStatus(pro, "Verified")}
                  sx={{ fontSize: "0.7rem", py: 0.25, px: 1.5, minWidth: 0, borderColor: "divider", color: "text.secondary", "&:hover": { borderColor: "success.main", color: "success.main" } }}
                >
                  {t("restoreBtn")}
                </Button>
              )}
            </Box>
          </Box>
        ))}
      </Paper>

      <Dialog
        open={!!selectedPro}
        onClose={() => setSelectedPro(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedPro && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    width: 48, height: 48,
                    bgcolor: "rgba(124,92,255,0.18)",
                    color: "primary.main",
                    fontWeight: 700,
                  }}
                >
                  {initials(selectedPro.name)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }} noWrap>
                    {selectedPro.name}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip
                      label={statusLabel[selectedPro.status]}
                      size="small"
                      color={statusColor[selectedPro.status]}
                      variant="outlined"
                      sx={{ fontSize: "0.65rem", height: 20 }}
                    />
                    <RatingStars value={selectedPro.rating} />
                  </Stack>
                </Box>
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2}>
                <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("tradeField")}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPro.category}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("cityField")}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPro.city}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("hourlyRateField")}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPro.hourlyRate} €</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">{t("reviewsField")}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPro.reviews}</Typography>
                  </Box>
                </Stack>
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {t("contactField")}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                    {selectedPro.email || "—"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">{t("proIdField")}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>#{selectedPro.id}</Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedPro(null)}>{t("closeBtn")}</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
