import { Box, Card, CardContent, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { TranslationKey } from '../../../i18n/translations';

const steps: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: 'step1Title', descKey: 'step1Desc' },
  { titleKey: 'step2Title', descKey: 'step2Desc' },
  { titleKey: 'step3Title', descKey: 'step3Desc' },
];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 3 }}>
          {t('howItWorks')}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {steps.map((s, idx) => (
            <Card key={s.titleKey}>
              <CardContent>
                <Typography sx={{ fontWeight: 800, opacity: 0.7 }}>
                  0{idx + 1}
                </Typography>

                <Typography variant="h4" sx={{ mt: 1 }}>
                  {t(s.titleKey)}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {t(s.descKey)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
