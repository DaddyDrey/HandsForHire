import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main-layout/MainLayout";
import HomePage from "../pages/home/HomePage";
import FindAProPage from "../pages/find-a-pro/FindAProPage";
import BecomeAProPage from "../pages/become-a-pro/BecomeAProPage";
import paths from "./paths";
import LoginPage from "../pages/Login-Page/Login";
import ProtectedRoute from "../auth/ProtectedRoute";
import Signup from "../pages/Login-Page/Signup";
import ProfilePage from "../pages/profile/ProfilePage";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: paths.login, element: <LoginPage /> },
      { path: paths.home, element: <HomePage /> },
      { path: paths.signup, element: <Signup /> },

      { path: paths.findAPro, element: <FindAProPage /> },

      { path: paths.account,
        element: (
          <ProtectedRoute>
            <ProfilePage />
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
    ],
  },
]);

export default router;
