import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Link as RouterLink } from 'react-router-dom';
import paths from '../../../routes/paths';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <Section
      sx={{
        pt: { xs: 10, md: 14 },
        pb: { xs: 7, md: 10 },
        minHeight: { xs: 'auto', md: '100vh' },
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `
          linear-gradient(
            90deg,
            rgba(4, 8, 20, 0.92) 0%,
            rgba(4, 8, 20, 0.82) 35%,
            rgba(4, 8, 20, 0.45) 65%,
            rgba(4, 8, 20, 0.62) 100%
          ),
          url('/images/hero/hero-bg.png')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      "&::after": {
  content: '""',
  position: "absolute",
  bottom: 0,
  left: 0,
  width: "100%",
  height: "160px",
background: "linear-gradient(to bottom, transparent 20%, #020817 100%)",  pointerEvents: "none",
  zIndex: 1,
},
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at top left, rgba(34, 197, 94, 0.12), transparent 22%),
            radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.20), transparent 28%)
          `,
          pointerEvents: 'none',
        }}
      />

      <ContainerMax sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={3.5} sx={{ maxWidth: 780 }}>
          <Chip
            label={t('heroChip')}
            sx={{
              width: 'fit-content',
              border: '1px solid rgba(124,92,255,0.4)',
              background: 'rgba(124,92,255,0.12)',
              color: '#A78BFA',
              fontWeight: 600,
              letterSpacing: '0.03em',
              backdropFilter: 'blur(8px)',
            }}
          />

          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', md: '3.6rem', lg: '4rem' },
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #F0F4FF 30%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('heroTitle')}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              maxWidth: 580,
              lineHeight: 1.75,
              color: 'rgba(226,232,240,0.82)',
            }}
          >
            {t('heroDescription')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="contained"
              size="large"
              component={RouterLink}
              to={paths.findAPro}
              sx={{
                background: 'linear-gradient(135deg, #7C5CFF 0%, #9B82FF 100%)',
                px: 3.5,
                py: 1.4,
                fontSize: '1rem',
                fontWeight: 700,
                boxShadow: '0 4px 24px rgba(124,92,255,0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6A4AED 0%, #8A70EF 100%)',
                  boxShadow: '0 6px 32px rgba(124,92,255,0.5)',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 200ms ease',
              }}
            >
              {t('findAPro')}
            </Button>

            <Button
              variant="outlined"
              size="large"
              component={RouterLink}
              to="/become-a-pro"
              sx={{
                borderColor: 'rgba(255,255,255,0.18)',
                color: '#F8FAFC',
                px: 3.5,
                py: 1.4,
                fontSize: '1rem',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(8px)',
                '&:hover': {
                  borderColor: 'rgba(124,92,255,0.6)',
                  background: 'rgba(124,92,255,0.08)',
                },
              }}
            >
              {t('becomeAProfessional')}
            </Button>
          </Stack>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', pt: 1 }}>
            {[
              { label: t('verifiedProfiles'), icon: '✓' },
              { label: t('ratingsReviews'), icon: '⭐' },
              { label: t('securePayments'), icon: '🔒' },
            ].map(({ label, icon }) => (
              <Chip
                key={label}
                label={`${icon} ${label}`}
                variant="outlined"
                sx={{
                  borderColor: 'rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(226,232,240,0.82)',
                  fontSize: '0.82rem',
                  backdropFilter: 'blur(8px)',
                }}
              />
            ))}
          </Box>
          
        </Stack>
      </ContainerMax>
    </Section>
  );
}
