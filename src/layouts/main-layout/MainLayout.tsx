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
          'radial-gradient(1200px 600px at 20% -10%, rgba(124,92,255,0.28), transparent 60%),' +
          'radial-gradient(900px 500px at 90% 0%, rgba(34,197,94,0.18), transparent 55%),' +
          'linear-gradient(180deg, #0B0F19 0%, #0B0F19 100%)',
      }}
    >
      <MainAppBar />
      <Box sx={{ pt: 10 }}>
        <Outlet />
      </Box>
      <MainFooter />
    </Box>
  );
}
