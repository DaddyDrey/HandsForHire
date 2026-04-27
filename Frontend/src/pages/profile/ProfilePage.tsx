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
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

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
import { MOCK_USER } from "../../mock_data/users";
import { useLanguage } from "../../i18n/useLanguage";
import { prosApi, type ProApiDto } from "../../api/prosApi";
import ContainerMax from "../../components/common/ContainerMax";
import Section from "../../components/common/Section";
import { useAnnouncementService, type Announcement as BackendAnnouncement } from "../../mock_data/announcements";
import { messagesApi } from "../../api/messagesApi";

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
      setMsg("Pro profile deleted.");
    } catch {
      setMsgSeverity("error");
      setMsg("Could not delete pro profile.");
    }
  };

  const { getForUser } = useAnnouncementService();
  const [announcements, setAnnouncements] = useState<BackendAnnouncement[] | null>(null);

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
      try {
        const data = await getForUser(resolved.id);
        if (!cancelled) setAnnouncements(data);
      } catch {
        if (!cancelled) setAnnouncements([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userEmail, getForUser]);

  const profile: Profile | null = useMemo(() => {
    if (!user) return null;

    if (user.email.toLowerCase() === MOCK_USER.email.toLowerCase()) {
      return MOCK_USER as Profile;
    }

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

  const onChangePassword = () => {
    setMsg("");

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
      changePassword(user.email, pwd);
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

                <Box sx={{ ml: "auto" }}>
                  <Button variant="text" disabled>
                    {t("changeMock")}
                  </Button>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ fontWeight: 800 }}>Pro profile</Typography>
              {proProfile && (
                <Button color="error" variant="outlined" size="small" onClick={onDeletePro}>
                  Delete pro profile
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
                  <Typography color="text.secondary" variant="body2">Trade</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{proProfile.trade}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">City</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{proProfile.city}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">Hourly rate</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{proProfile.hourlyRate}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">Display name</Typography>
                  <Typography sx={{ fontWeight: 700 }}>{proProfile.fullName}</Typography>
                </Box>
              </Stack>
            ) : (
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: "wrap" }}>
                <Typography color="text.secondary">
                  You haven't submitted a pro application yet.
                </Typography>
                <Button variant="contained" onClick={() => nav(paths.becomeAPro)}>
                  Become a Pro
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
              <Typography sx={{ fontWeight: 800 }}>{t("myAnnouncements")}</Typography>
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
                        alignItems="baseline"
                      >
                        <Typography sx={{ fontWeight: 750 }}>{a.title}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {a.status} • {a.createdAt.slice(0, 10)}
                        </Typography>
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
      </ContainerMax>
    </Section>
  );
}
