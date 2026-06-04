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

import paths from "../../routes/paths";
import {
  changePassword,
  deleteAccount,
  getUser,
  logout,
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

type ProHistory = {
  id: string;
  proId: string;
  proName: string;
  trade: string;
  city: string;
  viewedAt: string;
};

type Profile = {
  email: string;
  fullName: string;
  phone: string;
  city: string;
  createdAt: string;
  announcements: Announcement[];
  prosCheckedOut: ProHistory[];
};

export default function ProfilePage() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const user = getUser();

  const [avatar, setAvatar] = useState<string | null>(() => getAvatarDataUrl());
  const [currentPwd, setCurrentPwd] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [msg, setMsg] = useState("");
  const [msgSeverity, setMsgSeverity] = useState<"success" | "info" | "error">("info");

  const [proProfile, setProProfile] = useState<ProApiDto | null>(null);
  const [proLoading, setProLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProLoading(false);
      return;
    }
    let cancelled = false;
    prosApi.getByEmail(user.email)
      .then((data) => { if (!cancelled) setProProfile(data); })
      .finally(() => { if (!cancelled) setProLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const onDeletePro = async () => {
    if (!proProfile) return;
    try {
      await prosApi.delete(proProfile.id);
      setProProfile(null);
      setMsgSeverity("success");
      setMsg(t("proProfileDeletedToast"));
    } catch {
      setMsgSeverity("error");
      setMsg(t("couldNotDeleteProProfile"));
    }
  };

  const [announcements, setAnnouncements] = useState<BackendAnnouncement[] | null>(null);
  const [backendUserId, setBackendUserId] = useState<number | null>(null);

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
      email: user.email,
      fullName: t("newUser"),
      phone: "",
      city: "",
      createdAt: new Date().toISOString().slice(0, 10),
      announcements: [],
      prosCheckedOut: [],
    };
  }, [user, t]);

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

  const onLogout = () => {
    logout();
    nav(paths.home, { replace: true });
  };

  const onChangePassword = async () => {
    setMsg("");

    if (currentPwd.length < 6) {
      setMsgSeverity("error");
      setMsg(t("currentPasswordRequired"));
      return;
    }

    if (pwd.length < 6) {
      setMsgSeverity("error");
      setMsg(t("passwordTooShort"));
      return;
    }

    if (pwd !== pwd2) {
      setMsgSeverity("error");
      setMsg(t("passwordsMismatch"));
      return;
    }

    try {
      await changePassword(user.email, currentPwd, pwd);
      setCurrentPwd("");
      setPwd("");
      setPwd2("");
      setMsgSeverity("success");
      setMsg(t("passwordUpdated"));
    } catch (e: unknown) {
      setMsgSeverity("error");
      setMsg(e instanceof Error ? e.message : t("couldNotChangePassword"));
    }
  };

  const onDeleteAccount = () => {
    setMsg("");
    try {
      deleteAccount(user.email);
      nav(paths.home, { replace: true });
    } catch (e: unknown) {
      setMsgSeverity("error");
      setMsg(e instanceof Error ? e.message : t("couldNotDeleteAccount"));
    }
  };

  const helpHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    "handsforhiresupp@gmail.com"
  )}&su=${encodeURIComponent("HandsForHire - Help")}`;

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

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                alignItems={{ sm: "center" }}
                justifyContent="space-between"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar src={avatar ?? undefined} sx={{ width: 56, height: 56 }}>
                    {profile.email[0].toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography color="text.secondary" variant="body2">
                      {t("email")}
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>{profile.email}</Typography>
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

              <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {t("fullNameLabel")}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{profile.fullName}</Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {t("cityLabel")}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>
                    {profile.city || t("notProvided")}
                  </Typography>
                </Box>

                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {t("createdLabel")}
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{profile.createdAt}</Typography>
                </Box>

              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 800 }}>{t("proProfileSection")}</Typography>
              {proProfile && (
                <Button color="error" variant="outlined" size="small" onClick={onDeletePro}>
                  {t("deleteProProfileBtn")}
                </Button>
              )}
            </Stack>
            <Divider sx={{ my: 1.5 }} />

            {proLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress size={20} />
              </Box>
            ) : proProfile ? (
              <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">{t("tradeField")}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{proProfile.trade}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">{t("cityField")}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{proProfile.city}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">{t("hourlyRateField")}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{proProfile.hourlyRate}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">{t("displayNameField")}</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{proProfile.fullName}</Typography>
                </Box>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap" }}>
                <Typography color="text.secondary">
                  {t("noApplicationYet")}
                </Typography>
                <Button variant="contained" onClick={() => nav(paths.becomeAPro)}>
                  {t("becomeProBtn")}
                </Button>
              </Stack>
            )}
          </CardContent>
        </Card>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
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
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontWeight: 800 }}>{t("myAnnouncements")}</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setPostOpen(true)}
                  disabled={!backendUserId}
                >
                  {t("addNewBtn")}
                </Button>
              </Stack>
              <Divider sx={{ my: 1.5 }} />

              {announcements === null ? (
                <Typography color="text.secondary">…</Typography>
              ) : announcements.length === 0 ? (
                <Typography color="text.secondary">{t("noAnnouncementsYet")}</Typography>
              ) : (
                <Stack spacing={1}>
                  {announcements.map((a) => (
                    <Box
                      key={a.id}
                      sx={{
                        p: 1.25,
                        borderRadius: 2,
                        border: "1px solid rgba(255,255,255,0.10)",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontWeight: 750 }} noWrap>{a.title}</Typography>
                          <Typography color="text.secondary" variant="body2">
                            {a.status} • {a.createdAt.slice(0, 10)}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => openMenu(e, a.id)}
                          sx={{ flexShrink: 0 }}
                        >
                          <MenuRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
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
            <Typography sx={{ fontWeight: 800 }}>{t("security")}</Typography>
            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={1.5}>
              <TextField
                label={t("currentPassword")}
                type="password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
              />
              <TextField
                label={t("newPassword")}
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <TextField
                label={t("confirmPasswordLabel")}
                type="password"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
              />

              <Divider />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
                sx={{ flexWrap: "wrap" }}
              >
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Button variant="contained" onClick={onChangePassword}>
                    {t("changePasswordButton")}
                  </Button>

                  <Button color="error" variant="outlined" onClick={onDeleteAccount}>
                    {t("deleteAccountButton")}
                  </Button>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    component="a"
                    href={helpHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("help")}
                  </Button>

                  <Button variant="contained" onClick={onLogout}>
                    {t("logoutButton")}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
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
