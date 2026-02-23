import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main-layout/MainLayout";
import HomePage from "../pages/home/HomePage";
import FindAProPage from "../pages/find-a-pro/FindAProPage";
import paths from "./paths";
import LoginPage from "../pages/Login-Page/Login";
import ProtectedRoute from "../auth/ProtectedRoute";
import Signup from "../pages/Login-Page/Signup";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: paths.login, element: <LoginPage /> },
      { path: paths.home, element: <HomePage /> },
      { path: paths.signup, element: <Signup /> },
      { path: paths.findAPro,
        element: (
          <ProtectedRoute>
            <FindAProPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;