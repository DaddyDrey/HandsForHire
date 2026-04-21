import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/useLanguage';
import paths from '../../../routes/paths';
import { Link as RouterLink } from 'react-router-dom';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <Section sx={{ pb: { xs: 6, md: 10 } }}>
      <ContainerMax>
        <Card
          sx={{
            background:
              'linear-gradient(135deg, rgba(124,92,255,0.18) 0%, rgba(34,197,94,0.08) 100%)',
            border: '1px solid rgba(124,92,255,0.25)',
            boxShadow: '0 0 60px rgba(124,92,255,0.12)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
            >
              <Box sx={{ maxWidth: 520 }}>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {t('readyToGetWorkDone')}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
                  {t('ctaDescription')}
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ flexShrink: 0 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to={paths.findAPro}
                  sx={{
                    background: 'linear-gradient(135deg, #7C5CFF 0%, #9B82FF 100%)',
                    px: 3,
                    fontWeight: 700,
                    boxShadow: '0 4px 20px rgba(124,92,255,0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #6A4AED 0%, #8A70EF 100%)',
                      boxShadow: '0 6px 28px rgba(124,92,255,0.55)',
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
                    borderColor: 'rgba(255,255,255,0.2)',
                    color: 'text.primary',
                    px: 3,
                    '&:hover': {
                      borderColor: 'rgba(124,92,255,0.5)',
                      background: 'rgba(124,92,255,0.08)',
                    },
                  }}
                >
                  {t('becomeAPro')}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </ContainerMax>
    </Section>
  );
}
