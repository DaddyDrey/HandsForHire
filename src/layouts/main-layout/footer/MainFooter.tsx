import { Box, Divider, Typography } from '@mui/material';
import ContainerMax from '../../../components/common/ContainerMax';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function MainFooter() {
  const { t } = useLanguage();

  return (
    <Box sx={{ py: 6 }}>
      <ContainerMax>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} {t('footerText')}
        </Typography>
      </ContainerMax>
    </Box>
  );
}
