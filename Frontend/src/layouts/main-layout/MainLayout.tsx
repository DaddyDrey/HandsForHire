import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';
import MainAppBar from './app-bar/MainAppBar';
import MainFooter from './footer/MainFooter';
import paths from '../../routes/paths';
import ScrollToTop from '../../components/common/ScrollToTop';
import { MessagesDrawerProvider } from '../../components/messages/MessagesDrawerProvider';
import { getUser, updateStoredUser, type User } from '../../auth/auth';
import { usersApi } from '../../api/usersApi';
import { useLanguage } from '../../translations/useLanguage';

export default function MainLayout() {
  const location = useLocation();
  const { t } = useLanguage();
  const hideFooter = [paths.contacts, paths.about, paths.terms].includes(location.pathname);
  const isHomePage = location.pathname === paths.home;
  const [user, setUser] = useState<User | null>(() => getUser());

  useEffect(() => {
    const stored = getUser();
    setUser(stored);
    if (!stored?.email) return;

    let cancelled = false;
    usersApi.getByEmail(stored.email).then((fresh) => {
      if (cancelled || !fresh) return;
      const nextUser: User = {
        ...stored,
        fullName: fresh.fullName,
        email: fresh.email,
        city: fresh.city,
        birthYear: fresh.birthYear,
        phoneNumber: fresh.phoneNumber,
        status: fresh.status,
        warningCount: fresh.warningCount,
      };
      updateStoredUser(nextUser);
      setUser(nextUser);
    });

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

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
          {!!user?.warningCount && (
            <Box sx={{ px: { xs: 2, md: 4 }, pt: isHomePage ? { xs: 8, md: 9 } : 2 }}>
              <Alert severity="warning">
                {t("accountWarningNotice").replace("{n}", String(user.warningCount))}
              </Alert>
            </Box>
          )}
          <Outlet />
        </Box>
        {!hideFooter && <MainFooter />}
      </Box>
    </MessagesDrawerProvider>
  );
}
