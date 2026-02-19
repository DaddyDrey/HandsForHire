import { AppBar, Box, Button, IconButton, Toolbar, Tooltip } from '@mui/material';
import Logo from '../../../components/base/Logo';
import { useLanguage } from '../../../i18n/LanguageContext';
import { type Language } from '../../../i18n/translations';

const languages: Language[] = ['en', 'ro', 'ru'];

export default function MainAppBar() {
  const { t, language, setLanguage } = useLanguage();

  const cycleLanguage = () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(11,15,25,0.55)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Logo />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button color="inherit">{t('findAPro')}</Button>
          <Button color="inherit">{t('becomeAPro')}</Button>
          <Button variant="contained">{t('signIn')}</Button>
          <Tooltip title={`EN → RO → RU`}>
            <IconButton
              onClick={cycleLanguage}
              sx={{
                ml: 1,
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'inherit',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
              }}
            >
              {language.toUpperCase()}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
