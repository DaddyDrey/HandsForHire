import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";

import paths from "../../routes/paths";
import {
  getUser,
  setAvatarDataUrl,
  getAvatarDataUrl,
  clearAvatar,
} from "../../auth/auth";
import { useLanguage } from "../../translations/useLanguage";
import { prosApi, type ProApiDto } from "../../api/prosApi";
import ContainerMax from "../../components/common/ContainerMax";
import Section from "../../components/common/Section";
import { announcementsApi, type AnnouncementApiDto as BackendAnnouncement } from "../../api/announcementsApi";
import { messagesApi } from "../../api/messagesApi";
import { getProHistory, type ProHistoryItem } from "../../services/proHistoryStore";

const ANNOUNCEMENT_CATEGORIES: Array<{ value: string; key: 'catPlumbing' | 'catElectrical' | 'catCleaning' | 'catMoving' | 'catPainting' | 'catAssembly' | 'catHvac' | 'catHandyman' | 'catCarpentry' | 'catOther' }> = [
  { value: "Plumbing", key: "catPlumbing" },
  { value: "Electrical", key: "catElectrical" },
  { value: "Cleaning", key: "catCleaning" },
  { value: "Moving", key: "catMoving" },
  { value: "Painting", key: "catPainting" },
  { value: "Assembly", key: "catAssembly" },
  { value: "HVAC", key: "catHvac" },
  { value: "Handyman", key: "catHandyman" },
  { value: "Carpentry", key: "catCarpentry" },
  { value: "Other", key: "catOther" },
];

type Announcement = {
  id: string;
  title: string;
  status: string;
  createdAt: string;
};

type Profile = {
  email: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  birthYear: number | null;
  createdAt: string;
  announcements: Announcement[];
  prosCheckedOut: ProHistoryItem[];
};

export default function ProfilePage() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const user = getUser();

  const [avatar, setAvatar] = useState<string | null>(() => getAvatarDataUrl());
  const [msg, setMsg] = useState("");
  const [msgSeverity, setMsgSeverity] = useState<"success" | "info" | "error">("info");

  const [proProfiles, setProProfiles] = useState<ProApiDto[]>([]);
  const [proLoading, setProLoading] = useState(true);
  const proProfile = proProfiles[0] ?? null;
  const verifiedProProfile = proProfiles.find((pro) => pro.status === "Verified") ?? null;

  useEffect(() => {
    if (!user) {
      setProLoading(false);
      return;
    }
    let cancelled = false;
    prosApi.getAllByEmail(user.email)
      .then((data) => { if (!cancelled) setProProfiles(data); })
      .catch(() => { if (!cancelled) setProProfiles([]); })
      .finally(() => { if (!cancelled) setProLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const onDeletePro = async (id: number) => {
    try {
      await prosApi.delete(id);
      setProProfiles((prev) => prev.filter((pro) => pro.id !== id));
      setMsgSeverity("success");
      setMsg(t("proProfileDeletedToast"));
    } catch {
      setMsgSeverity("error");
      setMsg(t("couldNotDeleteProProfile"));
    }
  };

  const [announcements, setAnnouncements] = useState<BackendAnnouncement[] | null>(null);
  const [backendUserId, setBackendUserId] = useState<number | null>(null);
  const [backendUser, setBackendUser] = useState<Awaited<ReturnType<typeof messagesApi.getUserByEmail>> | null>(null);

  const userEmail = user?.email;
  useEffect(() => {
    if (!userEmail) return;
    let cancelled = false;
    (async () => {
      const resolved = await messagesApi.getUserByEmail(userEmail);
      if (!resolved) {
        if (!cancelled) setAnnouncements([]);
        return;
      }
      if (!cancelled) setBackendUserId(resolved.id);
      if (!cancelled) setBackendUser(resolved);
      try {
        const data = await announcementsApi.getForUser(resolved.id);
        if (!cancelled) setAnnouncements(data);
      } catch {
        if (!cancelled) setAnnouncements([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userEmail]);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuAnnouncementId, setMenuAnnouncementId] = useState<number | null>(null);
  const [viewedAnnouncement, setViewedAnnouncement] = useState<BackendAnnouncement | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, id: number) => {
    setMenuAnchor(e.currentTarget);
    setMenuAnnouncementId(id);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuAnnouncementId(null);
  };

  const onView = () => {
    const a = announcements?.find((x) => x.id === menuAnnouncementId) ?? null;
    setViewedAnnouncement(a);
    closeMenu();
  };
  const onDelete = () => {
    const id = menuAnnouncementId;
    closeMenu();
    if (id != null) handleDeleteAnnouncement(id);
  };

  const [postOpen, setPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postCity, setPostCity] = useState("");
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [postTouched, setPostTouched] = useState(false);

  const resetPostForm = () => {
    setPostTitle("");
    setPostDescription("");
    setPostCategory("");
    setPostCity("");
    setPostTouched(false);
  };

  const handleDeleteAnnouncement = async (id: number) => {
    if (!window.confirm(t("deleteAnnouncementConfirm"))) return;
    if (!backendUserId) {
      setMsgSeverity("error");
      setMsg(t("couldNotIdentifyAccount"));
      return;
    }
    try {
      await announcementsApi.deleteForUser(id, backendUserId);
      setAnnouncements((prev) => (prev ? prev.filter((a) => a.id !== id) : prev));
      setMsgSeverity("success");
      setMsg(t("announcementDeletedToast"));
    } catch {
      setMsgSeverity("error");
      setMsg(t("couldNotDeleteAnnouncement"));
    }
  };

  const handlePostSubmit = async () => {
    setPostTouched(true);
    if (!postTitle.trim() || !postDescription.trim() || !postCategory || !postCity.trim()) return;
    if (!verifiedProProfile) {
      setMsgSeverity("error");
      setMsg(t("proProfilePendingApproval"));
      return;
    }
    if (!backendUserId) {
      setMsgSeverity("error");
      setMsg(t("couldNotIdentifyAccount"));
      return;
    }
    setPostSubmitting(true);
    try {
      const created = await announcementsApi.create({
        userId: backendUserId,
        title: postTitle.trim(),
        description: postDescription.trim(),
        category: postCategory,
        city: postCity.trim(),
      });
      setAnnouncements((prev) => (prev ? [created, ...prev] : [created]));
      setPostOpen(false);
      resetPostForm();
      setMsgSeverity("success");
      setMsg(t("announcementPostedToast"));
    } catch {
      setMsgSeverity("error");
      setMsg(t("couldNotPostAnnouncement"));
    } finally {
      setPostSubmitting(false);
    }
  };

  const profile: Profile | null = useMemo(() => {
    if (!user) return null;

    return {
      email: backendUser?.email ?? user.email,
      fullName: backendUser?.fullName || user.fullName || user.email,
      phoneNumber: backendUser?.phoneNumber ?? user.phoneNumber ?? "",
      city: backendUser?.city ?? user.city ?? "",
      birthYear: backendUser?.birthYear ?? user.birthYear ?? null,
      createdAt: new Date().toISOString().slice(0, 10),
      announcements: [],
      prosCheckedOut: getProHistory(user.email),
    };
  }, [backendUser, user]);

  if (!user || !profile) return null;

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMsgSeverity("error");
      setMsg(t("selectImageFile"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setAvatarDataUrl(result);
        setAvatar(result);
        setMsgSeverity("success");
        setMsg(t("profilePhotoUpdated"));
      }
    };
    reader.readAsDataURL(file);
  };

  const announcementCount = announcements?.length ?? 0;
  const proAnnouncementHint = verifiedProProfile
    ? `${announcementCount} ${t("listingsCountLabel")}`
    : proProfile
      ? t("proProfilePendingApproval")
      : t("noApplicationYet");

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
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.3rem", md: "3.25rem" },
                lineHeight: 1.05,
              }}
            >
              {t("myAccount")}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              {t("privateAccountInfo")}
            </Typography>
          </Box>

        {msg && <Alert severity={msgSeverity}>{msg}</Alert>}

        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            borderColor: "rgba(255,255,255,0.10)",
            background: "rgba(14,20,37,0.78)",
            backdropFilter: "blur(14px)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack spacing={1.75}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontWeight: 800 }}>{t("account")}</Typography>
              </Stack>

              <Divider />

              <Stack spacing={2}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                    <Avatar
                      src={avatar ?? undefined}
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "rgba(124,92,255,0.22)",
                        border: "1px solid rgba(124,92,255,0.35)",
                      }}
                    >
                      {profile.email[0].toUpperCase()}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 900, fontSize: 20 }} noWrap>
                        {profile.fullName}
                      </Typography>
                      <Typography color="text.secondary" variant="body2" noWrap>
                        {profile.email}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    <Button variant="outlined" component="label">
                      {t("uploadPhoto")}
                      <input hidden type="file" accept="image/*" onChange={onAvatarChange} />
                    </Button>

                    <Button
                      variant="text"
                      color="error"
                      onClick={() => {
                        clearAvatar();
                        setAvatar(null);
                        setMsgSeverity("info");
                        setMsg(t("profilePhotoRemoved"));
                      }}
                    >
                      {t("removePhoto")}
                    </Button>
                  </Stack>
                </Stack>

                <Box
                  sx={{
                    display: "grid",
                    gap: 1.25,
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
                  }}
                >
                  {[
                    { label: t("cityLabel"), value: profile.city || t("notProvided"), icon: <LocationOnOutlinedIcon /> },
                    { label: t("birthYear"), value: profile.birthYear ?? t("notProvided"), icon: <CakeOutlinedIcon /> },
                    { label: "Phone number", value: profile.phoneNumber || t("notProvided"), icon: <PhoneOutlinedIcon /> },
                    { label: t("createdLabel"), value: profile.createdAt, icon: <CalendarTodayOutlinedIcon /> },
                  ].map((item) => (
                    <Stack
                      key={item.label}
                      direction="row"
                      spacing={1.25}
                      alignItems="center"
                      sx={{
                        minWidth: 0,
                        p: 1.5,
                        borderRadius: 2,
                        border: "1px solid rgba(255,255,255,0.08)",
                        bgcolor: "rgba(255,255,255,0.035)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: 1.5,
                          display: "grid",
                          placeItems: "center",
                          color: "primary.light",
                          bgcolor: "rgba(124,92,255,0.12)",
                          flexShrink: 0,
                          "& svg": { fontSize: 18 },
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography color="text.secondary" variant="caption" noWrap>
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontWeight: 800 }} noWrap>
                          {item.value}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            borderColor: "rgba(255,255,255,0.10)",
            background:
              "linear-gradient(135deg, rgba(18,25,44,0.94) 0%, rgba(16,25,38,0.92) 55%, rgba(22,35,30,0.90) 100%)",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 2.75 } }}>
            <Stack spacing={2.25}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1.5}
              >
                <Box>
                  <Typography sx={{ fontWeight: 850, fontSize: 18 }}>{t("proProfileSection")}</Typography>
                  {proProfiles.length > 0 && (
                    <Typography color="text.secondary" variant="body2">
                      {proProfiles.length} {t("listingsCountLabel")}
                    </Typography>
                  )}
                </Box>
                <Button variant="contained" size="small" onClick={() => nav(paths.becomeAPro)}>
                  {t("addNewBtn")}
                </Button>
              </Stack>
              <Divider />

              {proLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              ) : proProfiles.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  }}
                >
                  {proProfiles.map((pro) => (
                    <Stack
                      key={pro.id}
                      spacing={1.5}
                      sx={{
                        p: 1.6,
                        borderRadius: 2,
                        bgcolor: "rgba(255,255,255,0.035)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        minWidth: 0,
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" spacing={1} alignItems="flex-start">
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 850 }} noWrap>{pro.trade}</Typography>
                          <Typography color="text.secondary" variant="body2" noWrap>{pro.description}</Typography>
                        </Box>
                        <Button color="error" variant="outlined" size="small" onClick={() => onDeletePro(pro.id)}>
                          {t("deleteMenuItem")}
                        </Button>
                      </Stack>
                      <Box
                        sx={{
                          display: "grid",
                          gap: 1,
                          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                        }}
                      >
                        {[
                          [t("cityField"), pro.city],
                          [t("hourlyRateField"), `${pro.hourlyRate}`],
                          [t("displayNameField"), pro.fullName],
                        ].map(([label, value]) => (
                          <Box key={label} sx={{ minWidth: 0 }}>
                            <Typography color="text.secondary" variant="body2" noWrap>{label}</Typography>
                            <Typography sx={{ fontWeight: 800 }} noWrap>{value}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </Stack>
                  ))}
                </Box>
              ) : (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                  <Typography color="text.secondary" sx={{ flex: 1 }}>
                    {t("noApplicationYet")}
                  </Typography>
                  <Button variant="contained" onClick={() => nav(paths.becomeAPro)}>
                    {t("becomeProBtn")}
                  </Button>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "1fr",
            alignItems: "start",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: "rgba(255,255,255,0.10)",
              background: "rgba(14,20,37,0.78)",
              backdropFilter: "blur(14px)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "stretch", sm: "center" }}
                spacing={1.5}
              >
                <Box>
                  <Typography sx={{ fontWeight: 850 }}>{t("myJobs")}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {proAnnouncementHint}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<AddRoundedIcon />}
                  onClick={() => setPostOpen(true)}
                  disabled={!backendUserId || !verifiedProProfile}
                >
                  {t("addNewBtn")}
                </Button>
              </Stack>
              <Divider sx={{ my: 1.75 }} />

              {announcements === null ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                  <CircularProgress size={22} />
                </Box>
              ) : announcements.length === 0 ? (
                <Box
                  sx={{
                    py: 4,
                    textAlign: "center",
                    borderRadius: 2,
                    border: "1px dashed rgba(255,255,255,0.14)",
                    bgcolor: "rgba(255,255,255,0.025)",
                  }}
                >
                  <WorkOutlineRoundedIcon sx={{ fontSize: 38, opacity: 0.55, mb: 1 }} />
                  <Typography sx={{ fontWeight: 750 }}>{t("noAnnouncementsYet")}</Typography>
                  {verifiedProProfile && (
                    <Button variant="outlined" size="small" sx={{ mt: 1.5 }} onClick={() => setPostOpen(true)}>
                      {t("postNewAnnouncement")}
                    </Button>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
                  }}
                >
                  {announcements.map((a) => (
                    <Box
                      key={a.id}
                      sx={{
                        p: 1.6,
                        borderRadius: 2,
                        border: "1px solid rgba(255,255,255,0.10)",
                        bgcolor: "rgba(255,255,255,0.035)",
                        transition: "border-color 150ms ease, background-color 150ms ease, transform 150ms ease",
                        "&:hover": {
                          borderColor: "rgba(124,92,255,0.45)",
                          bgcolor: "rgba(124,92,255,0.08)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >
                      <Stack spacing={1.25}>
                        <Stack direction="row" justifyContent="space-between" spacing={1}>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
                              <Chip label={a.status} size="small" variant="outlined" />
                              <Typography color="text.secondary" variant="caption" noWrap>
                                {a.category}
                              </Typography>
                            </Stack>
                            <Typography sx={{ fontWeight: 850, fontSize: 15 }} noWrap>
                              {a.title}
                            </Typography>
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => openMenu(e, a.id)}
                            sx={{ flexShrink: 0, alignSelf: "flex-start" }}
                          >
                            <MenuRoundedIcon fontSize="small" />
                          </IconButton>
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
                          {a.description}
                        </Typography>

                        <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <LocationOnOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography color="text.secondary" variant="caption">{a.city || "—"}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 15, color: "text.secondary" }} />
                            <Typography color="text.secondary" variant="caption">{a.createdAt.slice(0, 10)}</Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: "rgba(255,255,255,0.10)",
              background: "rgba(14,20,37,0.78)",
              backdropFilter: "blur(14px)",
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Typography sx={{ fontWeight: 800 }}>{t("prosCheckedOutHistory")}</Typography>
              <Divider sx={{ my: 1.5 }} />

              {profile.prosCheckedOut.length === 0 ? (
                <Typography color="text.secondary">{t("noHistoryYet")}</Typography>
              ) : (
                <Stack spacing={1}>
                  {profile.prosCheckedOut.map((h) => (
                    <Box
                      key={h.id}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                      >
                        <Typography sx={{ fontWeight: 750 }}>
                          {h.proName} — {h.trade}
                        </Typography>
                        <Typography color="text.secondary" variant="body2">
                          {h.city} • {h.viewedAt}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Box>

        </Stack>

        <Menu
          anchorEl={menuAnchor}
          open={!!menuAnchor}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { minWidth: 140 } } }}
        >
          <MenuItem onClick={onView}>
            <VisibilityOutlinedIcon fontSize="small" sx={{ mr: 1.5 }} />
            {t("viewMenuItem")}
          </MenuItem>
          <MenuItem onClick={onDelete} sx={{ color: "error.main" }}>
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
            {t("deleteMenuItem")}
          </MenuItem>
        </Menu>

        <Dialog
          open={!!viewedAnnouncement}
          onClose={() => setViewedAnnouncement(null)}
          fullWidth
          maxWidth="sm"
        >
          {viewedAnnouncement && (
            <>
              <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{viewedAnnouncement.title}</Typography>
                  <Chip label={viewedAnnouncement.status} size="small" variant="outlined" />
                </Stack>
              </DialogTitle>
              <DialogContent dividers>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {t("descriptionField")}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}>
                      {viewedAnnouncement.description || "—"}
                    </Typography>
                  </Box>
                  <Divider />
                  <Stack direction="row" spacing={4} sx={{ flexWrap: "wrap" }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t("categoryField")}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{viewedAnnouncement.category}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t("cityField")}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{viewedAnnouncement.city || "—"}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t("createdAtField")}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{viewedAnnouncement.createdAt.slice(0, 10)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">{t("updatedAtField")}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{viewedAnnouncement.updatedAt.slice(0, 10)}</Typography>
                    </Box>
                  </Stack>
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setViewedAnnouncement(null)}>{t("closeBtn")}</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        <Dialog
          open={postOpen}
          onClose={() => { if (!postSubmitting) { setPostOpen(false); resetPostForm(); } }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{t("postNewAnnouncement")}</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2} sx={{ mt: 0.5 }}>
              <TextField
                label={t("titleField")}
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                error={postTouched && !postTitle.trim()}
                helperText={postTouched && !postTitle.trim() ? t("fieldRequiredShort") : ""}
                fullWidth
              />
              <TextField
                label={t("descriptionField")}
                value={postDescription}
                onChange={(e) => setPostDescription(e.target.value)}
                error={postTouched && !postDescription.trim()}
                helperText={postTouched && !postDescription.trim() ? t("fieldRequiredShort") : ""}
                multiline
                rows={4}
                fullWidth
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth error={postTouched && !postCategory}>
                  <InputLabel>{t("categoryField")}</InputLabel>
                  <Select
                    value={postCategory}
                    label={t("categoryField")}
                    onChange={(e) => setPostCategory(e.target.value)}
                  >
                    {ANNOUNCEMENT_CATEGORIES.map((c) => (
                      <MenuItem key={c.value} value={c.value}>{t(c.key)}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label={t("cityField")}
                  value={postCity}
                  onChange={(e) => setPostCity(e.target.value)}
                  error={postTouched && !postCity.trim()}
                  helperText={postTouched && !postCity.trim() ? t("fieldRequiredShort") : ""}
                  fullWidth
                />
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setPostOpen(false); resetPostForm(); }} disabled={postSubmitting}>
              {t("cancelBtn")}
            </Button>
            <Button onClick={handlePostSubmit} variant="contained" disabled={postSubmitting}>
              {postSubmitting ? t("postingBtn") : t("postBtn")}
            </Button>
          </DialogActions>
        </Dialog>
      </ContainerMax>
    </Section>
  );
}
