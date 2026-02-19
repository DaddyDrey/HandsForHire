import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/LanguageContext';

export default function CTA() {
  const { t } = useLanguage();

  return (
    <Section>
      <ContainerMax>
        <Card>
          <CardContent>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h3">{t('readyToGetWorkDone')}</Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {t('ctaDescription')}
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" size="large">{t('findAPro')}</Button>
                <Button variant="outlined" size="large">{t('becomeAPro')}</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </ContainerMax>
    </Section>
  );
}
