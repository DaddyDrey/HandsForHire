import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/LanguageContext';
import { Link as RouterLink } from "react-router-dom";
import paths from "../../../routes/paths";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <Section sx={{ pt: { xs: 8, md: 10 } }}>
      <ContainerMax>
        <Stack spacing={3} sx={{ maxWidth: 760 }}>
          <Chip
            label={t('heroChip')}
            sx={{ width: 'fit-content', border: '1px solid rgba(255,255,255,0.12)' }}
            variant="outlined"
          />

          <Typography variant="h1">
            {t('heroTitle')}
          </Typography>

          <Typography color="text.secondary" variant="body1">
            {t('heroDescription')}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" size="large" sx={{ bgcolor: '#800080' }} component={RouterLink} to={paths.findAPro} color="inherit">
              {t('findAPro')}
            </Button>

            <Button variant="outlined" size="large" component={RouterLink} to="/become-a-pro" color="inherit">
              {t('becomeAProfessional')}
            </Button>
          </Stack>

          {/* <Button component={RouterLink} to="/become-a-pro" color="inherit">
              {t("becomeAPro")}
            </Button> */}

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 2 }}>
            <Chip label={t('verifiedProfiles')} variant="outlined" />
            <Chip label={t('ratingsReviews')} variant="outlined" />
            <Chip label={t('securePayments')} variant="outlined" />
          </Box>
        </Stack>
      </ContainerMax>
    </Section>
  );
}