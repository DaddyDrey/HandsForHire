import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/main-layout/MainLayout";
import HomePage from "../pages/home/HomePage";
import FindAProPage from "../pages/find-a-pro/FindAProPage";
import paths from "./paths";

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: paths.home, element: <HomePage /> },
      { path: paths.findAPro, element: <FindAProPage /> },
    ],
  },
]);

export default router;
