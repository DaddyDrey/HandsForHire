import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
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
  const nav = useNavigate();
  const user = getUser();

  const [avatar, setAvatar] = useState<string | null>(() => getAvatarDataUrl());
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [msg, setMsg] = useState<string>("");

  const profile: Profile | null = useMemo(() => {
    if (!user) return null;

    if (user.email.toLowerCase() === MOCK_USER.email.toLowerCase()) {
      return MOCK_USER as Profile;
    }

    return {
      email: user.email,
      fullName: "New User",
      phone: "",
      city: "",
      createdAt: new Date().toISOString().slice(0, 10),
      announcements: [],
      prosCheckedOut: [],
    };
  }, [user]);

  if (!user || !profile) return null;

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMsg("Please select an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setAvatarDataUrl(result);
        setAvatar(result);
        setMsg("Profile photo updated (mock).");
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
    if (pwd.length < 6) return setMsg("Password must be at least 6 characters.");
    if (pwd !== pwd2) return setMsg("Passwords do not match.");

    try {
      changePassword(user.email, pwd);
      setPwd("");
      setPwd2("");
      setMsg("Password updated (mock).");
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Could not change password.");
    }
  };

  const onDeleteAccount = () => {
    setMsg("");
    try {
      deleteAccount(user.email);
      nav(paths.home, { replace: true });
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Could not delete account.");
    }
  };

  const helpHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    "handsforhiresupp@gmail.com"
  )}&su=${encodeURIComponent("HandsForHire - Help")}`;

  return (
    <Box sx={{ pt: 2 }}>
      <Stack spacing={2.5}>
        <Box sx={{ pl: { xs: 1, sm: 2 } }}>
          <Typography variant="h4" sx={{ fontWeight: 900 }}>
            My account
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Private account information (only you can see this).
          </Typography>
        </Box>

        {msg && (
          <Alert severity={msg.includes("updated") ? "success" : "info"}>
            {msg}
          </Alert>
        )}

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={1.75}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography sx={{ fontWeight: 800 }}>Account</Typography>
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
                      Email
                    </Typography>
                    <Typography sx={{ fontWeight: 700 }}>{profile.email}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Button variant="outlined" component="label">
                    Upload photo
                    <input hidden type="file" accept="image/*" onChange={onAvatarChange} />
                  </Button>

                  <Button
                    variant="text"
                    color="error"
                    onClick={() => {
                      clearAvatar();
                      setAvatar(null);
                      setMsg("Profile photo removed.");
                    }}
                  >
                    Remove photo
                  </Button>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: "wrap" }}>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Full name
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{profile.fullName}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    City
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{profile.city || "-"}</Typography>
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Created
                  </Typography>
                  <Typography sx={{ fontWeight: 700 }}>{profile.createdAt}</Typography>
                </Box>

                <Box sx={{ ml: "auto" }}>
                  <Button variant="text" disabled>
                    Change (mock)
                  </Button>
                </Box>
              </Stack>
            </Stack>
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
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800 }}>My announcements</Typography>
              <Divider sx={{ my: 1.5 }} />

              {profile.announcements.length === 0 ? (
                <Typography color="text.secondary">No announcements yet.</Typography>
              ) : (
                <Stack spacing={1}>
                  {profile.announcements.map((a) => (
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
                          {a.status} • {a.createdAt}
                        </Typography>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography sx={{ fontWeight: 800 }}>Pros checked out history</Typography>
              <Divider sx={{ my: 1.5 }} />

              {profile.prosCheckedOut.length === 0 ? (
                <Typography color="text.secondary">No history yet.</Typography>
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

        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography sx={{ fontWeight: 800 }}>Security</Typography>
            <Divider sx={{ my: 1.5 }} />

            <Stack spacing={1.5}>
              <TextField
                label="New password"
                type="password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <TextField
                label="Confirm password"
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
                    Change password
                  </Button>

                  <Button color="error" variant="outlined" onClick={onDeleteAccount}>
                    Delete account
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
                    Help
                  </Button>

                  <Button variant="contained" onClick={onLogout}>
                    Log out
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}