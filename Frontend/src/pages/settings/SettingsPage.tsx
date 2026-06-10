import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { useNavigate } from "react-router-dom";

import { changePassword, deleteAccount, getUser, logout, updateStoredUser } from "../../auth/auth";
import { usersApi, type UserApiDto } from "../../api/usersApi";
import ContainerMax from "../../components/common/ContainerMax";
import Section from "../../components/common/Section";
import paths from "../../routes/paths";
import { useLanguage } from "../../translations/useLanguage";
import { useAppTheme } from "../../theme/AppThemeProvider";
import type { ThemeModeId } from "../../theme/themeModes";

export default function SettingsPage() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const user = getUser();
  const { mode, modes, setMode } = useAppTheme();

  const [loadedUser, setLoadedUser] = useState<UserApiDto | null>(null);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [birthYear, setBirthYear] = useState(user?.birthYear ? String(user.birthYear) : "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");

  const [currentPwd, setCurrentPwd] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordSeverity, setPasswordSeverity] = useState<"success" | "error">("success");
  const [severity, setSeverity] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    if (!user?.email) return;
    let cancelled = false;
    usersApi.getByEmail(user.email).then((data) => {
      if (cancelled || !data) return;
      setLoadedUser(data);
      setFullName(data.fullName);
      setEmail(data.email);
      setCity(data.city ?? "");
      setBirthYear(data.birthYear ? String(data.birthYear) : "");
      setPhoneNumber(data.phoneNumber ?? "");
    });
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  if (!user) return null;

  const showMessage = (nextSeverity: typeof severity, nextMessage: string) => {
    setSeverity(nextSeverity);
    setMessage(nextMessage);
  };

  const saveAccount = async () => {
    const id = loadedUser?.id ?? user.id;
    const parsedBirthYear = birthYear.trim() ? Number(birthYear) : null;

    if (!fullName.trim() || !email.trim()) {
      showMessage("error", "Name and email are required.");
      return;
    }

    if (parsedBirthYear !== null && (Number.isNaN(parsedBirthYear) || parsedBirthYear < 1900)) {
      showMessage("error", "Enter a valid birth year.");
      return;
    }

    setSaving(true);
    try {
      await usersApi.update(id, {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        birthYear: parsedBirthYear,
        phoneNumber: phoneNumber.trim(),
      });

      updateStoredUser({
        id,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        birthYear: parsedBirthYear,
        phoneNumber: phoneNumber.trim(),
      });

      setLoadedUser((current) => current ? {
        ...current,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        city: city.trim(),
        birthYear: parsedBirthYear,
        phoneNumber: phoneNumber.trim(),
      } : current);

      showMessage("success", "Account updated.");
    } catch (error: unknown) {
      showMessage("error", error instanceof Error ? error.message : "Could not update account.");
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async () => {
    setPasswordMessage("");

    if (currentPwd.length < 6) {
      showMessage("error", t("currentPasswordRequired"));
      setPasswordSeverity("error");
      setPasswordMessage(t("currentPasswordRequired"));
      return;
    }

    if (pwd.length < 6) {
      showMessage("error", t("passwordTooShort"));
      setPasswordSeverity("error");
      setPasswordMessage(t("passwordTooShort"));
      return;
    }

    if (pwd !== pwd2) {
      showMessage("error", t("passwordsMismatch"));
      setPasswordSeverity("error");
      setPasswordMessage(t("passwordsMismatch"));
      return;
    }

    try {
      await changePassword(user.email, currentPwd, pwd);
      setCurrentPwd("");
      setPwd("");
      setPwd2("");
      showMessage("success", t("passwordUpdated"));
      setPasswordSeverity("success");
      setPasswordMessage(t("passwordUpdated"));
    } catch (error: unknown) {
      const nextMessage = error instanceof Error ? error.message : t("couldNotChangePassword");
      showMessage("error", nextMessage);
      setPasswordSeverity("error");
      setPasswordMessage(nextMessage);
    }
  };

  const onDeleteAccount = () => {
    try {
      deleteAccount(user.email);
      nav(paths.home, { replace: true });
    } catch (error: unknown) {
      showMessage("error", error instanceof Error ? error.message : t("couldNotDeleteAccount"));
    }
  };

  const onLogout = () => {
    logout();
    nav(paths.home, { replace: true });
  };

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
            <Typography variant="h1" sx={{ fontSize: { xs: "2.3rem", md: "3.25rem" }, lineHeight: 1.05 }}>
              Settings
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              Manage your account, security, and workspace theme.
            </Typography>
          </Box>

          {message && <Alert severity={severity}>{message}</Alert>}

          <Card variant="outlined" sx={panelSx}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={2}>
                <Typography sx={{ fontWeight: 850, fontSize: 18 }}>Account</Typography>
                <Divider />
                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" } }}>
                  <TextField label={t("fullNameLabel")} value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  <TextField label={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} />
                  <TextField label={t("cityLabel")} value={city} onChange={(e) => setCity(e.target.value)} />
                  <TextField
                    label={t("birthYear")}
                    value={birthYear}
                    type="number"
                    onChange={(e) => setBirthYear(e.target.value)}
                    inputProps={{ min: 1900, max: new Date().getFullYear() - 16 }}
                  />
                  <TextField
                    label="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    sx={{ gridColumn: { md: "span 2" } }}
                  />
                </Box>
                <Button
                  variant="contained"
                  startIcon={<SaveRoundedIcon />}
                  onClick={saveAccount}
                  disabled={saving}
                  sx={{ alignSelf: "flex-start" }}
                >
                  Save account
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={panelSx}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PaletteOutlinedIcon color="primary" />
                  <Typography sx={{ fontWeight: 850, fontSize: 18 }}>Theme</Typography>
                </Stack>
                <Divider />
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" },
                  }}
                >
                  {modes.map((themeMode) => {
                    const selected = mode.id === themeMode.id;
                    return (
                      <Button
                        key={themeMode.id}
                        onClick={() => setMode(themeMode.id as ThemeModeId)}
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          border: selected ? `1px solid ${themeMode.primaryLight}` : "1px solid rgba(255,255,255,0.10)",
                          bgcolor: selected ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.025)",
                          color: "text.primary",
                          display: "block",
                          textAlign: "left",
                        }}
                      >
                        <Box sx={{ height: 74, borderRadius: 1.5, background: themeMode.preview, mb: 1 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontWeight: 800 }}>{themeMode.name}</Typography>
                          {selected && <CheckRoundedIcon fontSize="small" />}
                        </Stack>
                      </Button>
                    );
                  })}
                </Box>

                <Box
                  sx={{
                    mt: 0.5,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.10)",
                    bgcolor: "background.paper",
                  }}
                >
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontWeight: 850 }}>Preview</Typography>
                      <Chip label={mode.name} size="small" color="primary" />
                    </Stack>
                    <Box sx={{ height: 86, borderRadius: 2, background: mode.preview }} />
                    <Stack direction="row" spacing={1}>
                      <Button variant="contained">Primary</Button>
                      <Button variant="outlined">Secondary</Button>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={panelSx}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={1.5}>
                <Typography sx={{ fontWeight: 850, fontSize: 18 }}>{t("security")}</Typography>
                <Divider />
                <TextField label={t("currentPassword")} type="password" value={currentPwd} onChange={(e) => setCurrentPwd(e.target.value)} />
                <TextField label={t("newPassword")} type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
                <TextField label={t("confirmPasswordLabel")} type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} />
                {passwordMessage && <Alert severity={passwordSeverity}>{passwordMessage}</Alert>}
                <Divider />
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  alignItems={{ xs: "stretch", sm: "center" }}
                  spacing={1.5}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                    <Button variant="contained" onClick={onChangePassword}>{t("changePasswordButton")}</Button>
                    <Button color="error" variant="outlined" onClick={onDeleteAccount}>{t("deleteAccountButton")}</Button>
                  </Stack>
                  <Button variant="outlined" startIcon={<LogoutRoundedIcon />} onClick={onLogout}>
                    {t("logoutButton")}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </ContainerMax>
    </Section>
  );
}

const panelSx = {
  borderRadius: 3,
  borderColor: "rgba(255,255,255,0.10)",
  background: "rgba(14,20,37,0.78)",
  backdropFilter: "blur(14px)",
};
