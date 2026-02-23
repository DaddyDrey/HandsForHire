import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login, saveMockUser } from "../../auth/auth.ts";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function Signup() {
  const nav = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const st = location.state as { from?: string } | null;
    return st?.from || "/";
  }, [location.state]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) return setError("Introdu un email valid.");
    if (password.length < 6) return setError("Parola trebuie să aibă minim 6 caractere.");
    if (password !== confirm) return setError("Parolele nu coincid.");

    try {
      setLoading(true);

      
      saveMockUser(email, password);

      await login(email, password, remember);

      nav(redirectTo, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Nu s-a putut face signup.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create account</h1>
        <p style={styles.sub}>Mock signup (fără backend).</p>

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
              autoComplete="new-password"
            />
          </label>

          <label style={styles.label}>
            Confirmă parola
            <input
              style={styles.input}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
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
            {loading ? "Se creează..." : "Sign up"}
          </button>

          <div style={{ fontSize: 13, opacity: 0.9 }}>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => nav("/login")}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textDecoration: "underline",
                fontWeight: 700,
                color: "inherit",
              }}
            >
              Sign in
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