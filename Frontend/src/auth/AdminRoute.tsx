// src/auth/AdminRoute.tsx
// Wraps admin pages — redirects to /login if not authenticated,
// or to / if the logged-in user is not an admin.

import { Navigate } from "react-router-dom";
import { getUser } from "./auth";

const ADMIN_EMAILS = ["demo@handsforhire.com"]; // extend as needed

interface Props {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const user = getUser();

  if (!user) return <Navigate to="/login" replace />;
  if (!ADMIN_EMAILS.includes(user.email)) return <Navigate to="/" replace />;

  return <>{children}</>;
}
