import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main-layout/MainLayout";
import AdminLayout from "../layouts/admin-layout/AdminLayout";
import HomePage from "../pages/home/HomePage";
import FindAProPage from "../pages/find-a-pro/FindAProPage";
import BecomeAProPage from "../pages/become-a-pro/BecomeAProPage";
import PostJobPage from "../pages/post-job/PostJobPage";
import paths from "./paths";
import LoginPage from "../pages/Login-Page/Login";
import ProtectedRoute from "../auth/ProtectedRoute";
import AdminRoute from "../auth/AdminRoute";
import Signup from "../pages/Login-Page/Signup";
import ProfilePage from "../pages/profile/ProfilePage";
import MyListingsPage from "../pages/my-listings/MyListingsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import ContactsPage from "../pages/contacts/ContactsPage";
import AboutPage from "../pages/about/AboutPage";
import TermsPage from "../pages/terms/TermsPage";
import DashboardPage from "../pages/admin/DashboardPage";
import UsersPage from "../pages/admin/UsersPage";
import ProsPage from "../pages/admin/ProsPage";
import ProfessionsPage from "../pages/admin/ProfessionsPage";
import JobsPage from "../pages/admin/JobsPage";
import ReportsPage from "../pages/admin/ReportsPage";
import ProReviewsPage from "../pages/reviews/ProReviewsPage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: paths.login, element: <LoginPage /> },
      { path: paths.home, element: <HomePage /> },
      { path: paths.signup, element: <Signup /> },
      { path: paths.contacts, element: <ContactsPage /> },
      { path: paths.about, element: <AboutPage /> },
      { path: paths.terms, element: <TermsPage /> },
      { path: paths.findAPro, element: <FindAProPage /> },
      {
        path: paths.postJob,
        element: (
          <ProtectedRoute>
            <PostJobPage />
          </ProtectedRoute>
        ),
      },
      {
        path: paths.becomeAPro,
        element: (
          <ProtectedRoute>
            <BecomeAProPage />
          </ProtectedRoute>
        ),
      },
      {
        path: paths.account,
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: paths.myListings,
        element: (
          <ProtectedRoute>
            <MyListingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: paths.settings,
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: paths.proReviews,
        element: (
          <ProtectedRoute>
            <ProReviewsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: paths.admin,
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true,          element: <DashboardPage /> },
      { path: "users",        element: <UsersPage /> },
      { path: "pros",         element: <ProsPage /> },
      { path: "professions",  element: <ProfessionsPage /> },
      { path: "jobs",         element: <JobsPage /> },
      { path: "reports",      element: <ReportsPage /> },
    ],
  },
]);

export default router;
