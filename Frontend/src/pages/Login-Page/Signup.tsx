import React, { useMemo, useState } from "react";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useLocation, useNavigate } from "react-router-dom";
import { register } from "../../auth/auth.ts";
import { useLanguage } from "../../translations/useLanguage";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

const REMEMBERED_EMAIL_KEY = "handsforhire_remembered_email";

export default function Signup() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const st = location.state as { from?: string } | null;
    return st?.from || "/";
  }, [location.state]);

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) return setError(t("invalidEmail"));
    if (password.length < 6) return setError(t("passwordTooShort"));
    if (password !== confirm) return setError(t("passwordsMismatch"));

    try {
      setLoading(true);
      await register(fullName || email.split("@")[0], email, password, remember);
      if (remember) localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim().toLowerCase());
      else localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      nav(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("signupFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>{t("signupTitle")}</h1>
        <p style={styles.sub}>{t("signupSubtitle")}</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={styles.label}>
            {t("fullName")}
            <input
              style={styles.input}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              placeholder={t("fullNamePlaceholder")}
              autoComplete="name"
            />
          </label>

          <label style={styles.label}>
            {t("email")}
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
            />
          </label>

          <label style={styles.label}>
            {t("password")}
            <span style={styles.passwordWrap}>
              <input
                style={{ ...styles.input, ...styles.passwordInput }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="********"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                title={showPassword ? t("hidePassword") : t("showPassword")}
                onClick={() => setShowPassword((current) => !current)}
                style={styles.passwordToggle}
              >
                {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
              </button>
            </span>
          </label>

          <label style={styles.label}>
            {t("confirmPassword")}
            <span style={styles.passwordWrap}>
              <input
                style={{ ...styles.input, ...styles.passwordInput }}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                type={showConfirm ? "text" : "password"}
                placeholder="********"
                autoComplete="new-password"
              />
              <button
                type="button"
                aria-label={showConfirm ? t("hidePassword") : t("showPassword")}
                title={showConfirm ? t("hidePassword") : t("showPassword")}
                onClick={() => setShowConfirm((current) => !current)}
                style={styles.passwordToggle}
              >
                {showConfirm ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
              </button>
            </span>
          </label>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            {t("rememberMe")}
          </label>

          <button disabled={loading} style={styles.button} type="submit">
            {loading ? t("creatingAccount") : t("signupButton")}
          </button>

          <div style={{ fontSize: 13, opacity: 0.9 }}>
            {t("alreadyHaveAccount")}{" "}
            <button
              type="button"
              onClick={() => nav("/login")}
              style={styles.linkButton}
            >
              {t("signInLink")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 16,
  },
  card: {
    width: "min(420px, 100%)",
    padding: 20,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(8px)",
  },
  title: { margin: 0, fontSize: 28 },
  sub: { marginTop: 6, opacity: 0.85 },
  label: { display: "grid", gap: 6, fontSize: 14 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.15)",
    color: "inherit",
    outline: "none",
  },
  passwordWrap: {
    position: "relative",
    display: "block",
  },
  passwordInput: {
    paddingRight: 44,
  },
  passwordToggle: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    width: 32,
    height: 32,
    border: "none",
    borderRadius: 8,
    background: "transparent",
    color: "inherit",
    cursor: "pointer",
    display: "grid",
    placeItems: "center",
    opacity: 0.78,
  },
  checkboxRow: { display: "flex", gap: 8, alignItems: "center", fontSize: 14 },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },
  linkButton: {
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    textDecoration: "underline",
    fontWeight: 700,
    color: "inherit",
  },
  error: {
    marginTop: 10,
    marginBottom: 6,
    padding: 10,
    borderRadius: 10,
    border: "1px solid rgba(255,0,0,0.35)",
    background: "rgba(255,0,0,0.08)",
  },
};
