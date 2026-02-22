import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../auth/auth.ts";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function LoginPage() {
  const nav = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const st = location.state as { from?: string } | null;
    return st?.from || "/";
  }, [location.state]);

  const [email, setEmail] = useState("demo@handsforhire.com");
  const [password, setPassword] = useState("demo1234");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError("Introdu un email valid.");
      return;
    }
    if (password.length < 6) {
      setError("Parola trebuie să aibă minim 6 caractere.");
      return;
    }

try {
  setLoading(true);
  await login(email, password, remember);
  nav(redirectTo, { replace: true });
} catch (err: unknown) {
  const message =
    err instanceof Error ? err.message : "Nu s-a putut face login.";
  setError(message);
} finally {
  setLoading(false);
}
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Login</h1>
        <p style={styles.sub}>
          Demo: <b>demo@handsforhire.com</b> / <b>demo1234</b>
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label style={styles.label}>
            Parolă
            <input
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <label style={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Ține-mă minte
          </label>

          <button disabled={loading} style={styles.button} type="submit">
            {loading ? "Se autentifică..." : "Autentificare"}
          </button>
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
  checkboxRow: { display: "flex", gap: 8, alignItems: "center", fontSize: 14 },
  button: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
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