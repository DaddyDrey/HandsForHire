import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/main-layout/MainLayout';
import HomePage from '../pages/home/HomePage';
import paths from './paths';

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [{ path: paths.home, element: <HomePage /> }],
  },
]);

export default router;
