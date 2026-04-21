import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import MainAppBar from './app-bar/MainAppBar';
import MainFooter from './footer/MainFooter';

export default function MainLayout() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse 1400px 700px at 15% -5%, rgba(124,92,255,0.22) 0%, transparent 65%),' +
          'radial-gradient(ellipse 1000px 600px at 85% 5%, rgba(34,197,94,0.13) 0%, transparent 60%),' +
          'radial-gradient(ellipse 800px 400px at 50% 100%, rgba(124,92,255,0.08) 0%, transparent 70%),' +
          'linear-gradient(180deg, #080C16 0%, #080C16 100%)',
      }}
    >
      <MainAppBar />
      <Box sx={{ pt: 0 }}>
        <Outlet />
      </Box>
      <MainFooter />
    </Box>
  );
}
