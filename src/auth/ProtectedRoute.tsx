import { Navigate, useLocation } from "react-router-dom";
import { getUser } from "./auth";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return children;
}