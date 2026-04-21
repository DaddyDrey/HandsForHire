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
//    import AdminLayout   from "../layouts/admin-layout/AdminLayout";
//    import AdminRoute    from "../auth/AdminRoute";
//    import DashboardPage from "../pages/admin/DashboardPage";
//    import UsersPage     from "../pages/admin/UsersPage";
//    import ProsPage      from "../pages/admin/ProsPage";
//    import JobsPage      from "../pages/admin/JobsPage";
//    import ReportsPage   from "../pages/admin/ReportsPage";
//
// 2. Add the admin subtree to your router array (outside the MainLayout route):
//
//    {
//      path: "/admin",
//      element: (
//        <AdminRoute>
//          <AdminLayout />
//        </AdminRoute>
//      ),
//      children: [
//        { index: true,            element: <DashboardPage /> },
//        { path: "users",          element: <UsersPage /> },
//        { path: "pros",           element: <ProsPage /> },
//        { path: "jobs",           element: <JobsPage /> },
//        { path: "reports",        element: <ReportsPage /> },
//      ],
//    },
//
// 3. Add the admin path to paths.ts:
//
//    admin: "/admin",
