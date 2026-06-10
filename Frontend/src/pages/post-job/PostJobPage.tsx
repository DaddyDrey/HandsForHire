import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";

import axiosInstance from "../../api/axiosInstance";
import ContainerMax from "../../components/common/ContainerMax";
import Section from "../../components/common/Section";
import { getUser, isSuspended } from "../../auth/auth";
import { useAnnouncementService, type Announcement, type AnnouncementStatus } from "../../mock_data/announcements";
import type { UserApiDto } from "../../api/messagesApi";
import { useLanguage } from "../../translations/useLanguage";
import type { TranslationKey } from "../../translations/translations";

const CATEGORIES: { value: string; key: TranslationKey }[] = [
  { value: "Plumbing", key: "catPlumbing" },
  { value: "Moving", key: "catMoving" },
  { value: "Cleaning", key: "catCleaning" },
  { value: "Electrical", key: "catElectrical" },
  { value: "Painting", key: "catPainting" },
  { value: "Assembly", key: "catAssembly" },
  { value: "HVAC", key: "catHvac" },
  { value: "Handyman", key: "catHandyman" },
  { value: "Other", key: "otherTrade" },
];

const statusKey: Record<AnnouncementStatus, TranslationKey> = {
  Open: "statusOpen",
  InProgress: "statusInProgress",
  Completed: "statusCompleted",
  Cancelled: "statusCancelled",
  Paused: "statusPaused",
};

export default function PostJobPage() {
  const { t } = useLanguage();
  const user = getUser();
  const suspended = isSuspended(user);
  const { getAll, create } = useAnnouncementService();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAll()
      .then((data) => {
        if (!cancelled) {
          setAnnouncements(data);
          setError("");
        }
      })
      .catch(() => {
        if (!cancelled) setError(t("couldNotLoadRequests"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [getAll, t]);

  const ensureBackendUser = async (): Promise<UserApiDto> => {
    const email = user?.email.trim().toLowerCase();
    if (!email) throw new Error(t("loginToPostJob"));

    try {
      const { data } = await axiosInstance.get<UserApiDto>(`/Users/by-email/${encodeURIComponent(email)}`);
      return data;
    } catch {
      const { data } = await axiosInstance.post<UserApiDto>("/Users", {
        fullName: email.split("@")[0],
        email,
      });
      return data;
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setCity("");
    setSubmitted(false);
  };

  const closeDialog = () => {
    if (saving) return;
    setDialogOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (suspended) {
      setError(t("suspendedCreationBlocked"));
      return;
    }

    if (!title.trim() || !description.trim() || !category || !city.trim()) return;

    try {
      setSaving(true);
      const backendUser = await ensureBackendUser();
      if (backendUser.status === "Suspended") {
        setError(t("suspendedCreationBlocked"));
        return;
      }

      const created = await create({
        userId: backendUser.id,
        title: title.trim(),
        description: description.trim(),
        category,
        city: city.trim(),
      });

      setAnnouncements((current) => [created, ...current]);
      setDialogOpen(false);
      resetForm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("couldNotPostJob"));
    } finally {
      setSaving(false);
    }
  };

  const hasError = (value: string) => submitted && !value.trim();
  const getCategoryLabel = (value: string) => t(CATEGORIES.find((option) => option.value === value)?.key ?? "otherTrade");

  return (
    <Section sx={{ py: { xs: 3, md: 5 } }}>
      <ContainerMax>
        <Stack spacing={3}>
          <Box
            sx={{
              px: { xs: 2.5, md: 4 },
              py: { xs: 3, md: 4 },
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              background:
                "linear-gradient(135deg, rgba(124,92,255,0.14) 0%, rgba(34,197,94,0.07) 55%, rgba(255,255,255,0.03) 100%)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.22)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h1" sx={{ fontSize: { xs: "2.3rem", md: "3.25rem" }, lineHeight: 1.05 }}>
                  {t("announcementsNav")}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
                  {t("PostJobDescription")}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<AddRoundedIcon />}
                onClick={() => setDialogOpen(true)}
                disabled={suspended}
                sx={{ alignSelf: { xs: "stretch", md: "center" } }}
              >
                {t("addBtn")}
              </Button>
            </Stack>
          </Box>

          {suspended && <Alert severity="warning">{t("suspendedCreationBlocked")}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Card variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={2.25}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                  spacing={1.5}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 850, fontSize: 18 }}>{t("activeRequests")}</Typography>
                    <Typography color="text.secondary" variant="body2">
                      {announcements.length} {t("requestsCountLabel")}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<AddRoundedIcon />}
                    onClick={() => setDialogOpen(true)}
                    disabled={suspended}
                  >
                    {t("addBtn")}
                  </Button>
                </Stack>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : announcements.length === 0 ? (
                  <Box
                    sx={{
                      py: 6,
                      px: 2,
                      textAlign: "center",
                      borderRadius: 2,
                      border: "1px dashed rgba(255,255,255,0.16)",
                      bgcolor: "rgba(255,255,255,0.025)",
                    }}
                  >
                    <WorkOutlineRoundedIcon sx={{ fontSize: 44, opacity: 0.6, mb: 1 }} />
                    <Typography sx={{ fontWeight: 850, fontSize: 18 }}>{t("noActiveRequestsYet")}</Typography>
                    <Typography color="text.secondary" sx={{ mt: 0.75, mb: 2 }}>
                      {t("createFirstRequest")}
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddRoundedIcon />}
                      onClick={() => setDialogOpen(true)}
                      disabled={suspended}
                    >
                      {t("addBtn")}
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gap: 2,
                      gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                    }}
                  >
                    {announcements.map((announcement) => (
                      <Stack
                        key={announcement.id}
                        spacing={1.75}
                        sx={{
                          p: { xs: 1.75, md: 2 },
                          minWidth: 0,
                          borderRadius: 2,
                          border: "1px solid rgba(255,255,255,0.10)",
                          bgcolor: "rgba(255,255,255,0.035)",
                        }}
                      >
                        <Stack direction="row" spacing={1.5} alignItems="flex-start">
                          <Avatar
                            sx={{
                              width: 42,
                              height: 42,
                              bgcolor: "rgba(245,158,11,0.18)",
                              color: "warning.light",
                              border: "1px solid rgba(245,158,11,0.30)",
                            }}
                          >
                            {announcement.title[0]?.toUpperCase() ?? "A"}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                              <Typography sx={{ fontWeight: 900, fontSize: 17 }} noWrap>
                                {announcement.title}
                              </Typography>
                              <Chip size="small" label={t(statusKey[announcement.status])} variant="outlined" />
                            </Stack>
                            <Typography color="text.secondary" variant="body2" noWrap>
                              {getCategoryLabel(announcement.category)}
                            </Typography>
                          </Box>
                        </Stack>

                        <Typography
                          color="text.secondary"
                          variant="body2"
                          sx={{
                            minHeight: 40,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {announcement.description || t("noDescriptionProvided")}
                        </Typography>

                        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0, color: "text.secondary" }}>
                          <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
                          <Typography variant="body2" noWrap>
                            {announcement.city}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
          <DialogTitle>{t("PostAnAnnouncement")}</DialogTitle>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ mt: 0.5 }}>
                <TextField
                  fullWidth
                  label={t("jobTitle")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  error={hasError(title)}
                  helperText={hasError(title) ? t("titleRequired") : ""}
                />

                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <FormControl fullWidth error={submitted && !category}>
                    <InputLabel>{t("categoryField")}</InputLabel>
                    <Select value={category} label={t("categoryField")} onChange={(e) => setCategory(e.target.value)}>
                      {CATEGORIES.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {t(option.key)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    label={t("city")}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    error={hasError(city)}
                    helperText={hasError(city) ? t("cityRequired") : ""}
                  />
                </Stack>

                <TextField
                  fullWidth
                  label={t("description")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={hasError(description)}
                  helperText={hasError(description) ? t("descriptionRequired") : ""}
                  multiline
                  rows={5}
                />
              </Stack>
            </DialogContent>

            <DialogActions>
              <Button onClick={closeDialog} disabled={saving}>
                {t("cancelBtn")}
              </Button>
              <Button type="submit" variant="contained" disabled={saving || suspended}>
                {saving ? t("postingBtn") : t("postJobButton")}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </ContainerMax>
    </Section>
  );
}
