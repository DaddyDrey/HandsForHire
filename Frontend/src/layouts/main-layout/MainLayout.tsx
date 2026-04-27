import { Outlet, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import MainAppBar from './app-bar/MainAppBar';
import MainFooter from './footer/MainFooter';
import paths from '../../routes/paths';
import ScrollToTop from '../../components/common/ScrollToTop';
import { MessagesDrawerProvider } from '../../components/messages/MessagesDrawerProvider';

export default function MainLayout() {
  const location = useLocation();
  const hideFooter = [paths.contacts, paths.about, paths.terms].includes(location.pathname);
  const isHomePage = location.pathname === paths.home;

  return (
    <MessagesDrawerProvider>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background:
            'radial-gradient(ellipse 1400px 700px at 15% -5%, rgba(124,92,255,0.22) 0%, transparent 65%),' +
            'radial-gradient(ellipse 1000px 600px at 85% 5%, rgba(34,197,94,0.13) 0%, transparent 60%),' +
            'radial-gradient(ellipse 800px 400px at 50% 100%, rgba(124,92,255,0.08) 0%, transparent 70%),' +
            'linear-gradient(180deg, #080C16 0%, #080C16 100%)',
        }}
      >
        <ScrollToTop />
        <MainAppBar />
        <Box component="main" sx={{ flex: 1, pt: isHomePage ? 0 : { xs: 8, md: 9 } }}>
          <Outlet />
        </Box>
        {!hideFooter && <MainFooter />}
      </Box>
    </MessagesDrawerProvider>
  );
}
