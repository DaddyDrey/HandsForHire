import { Box, Card, CardContent, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/useLanguage';
import type { TranslationKey } from '../../../i18n/translations';

const steps: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
  { titleKey: 'step1Title', descKey: 'step1Desc' },
  { titleKey: 'step2Title', descKey: 'step2Desc' },
  { titleKey: 'step3Title', descKey: 'step3Desc' },
];

// Culori per step
const stepColors = ['#7C5CFF', '#22C55E', '#F59E0B'];

export default function HowItWorks() {
  const { t } = useLanguage();

  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 1 }}>
          {t('howItWorks')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3.5 }}>
          Three simple steps to get your project done right.
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          {steps.map((s, idx) => (
            <Card
              key={s.titleKey}
              sx={{
                borderLeft: `3px solid ${stepColors[idx]}`,
                background: 'rgba(255,255,255,0.03)',
                transition: 'transform 160ms ease, box-shadow 160ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${stepColors[idx]}22`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    fontSize: '2rem',
                    lineHeight: 1,
                    color: stepColors[idx],
                    opacity: 0.85,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  0{idx + 1}
                </Typography>

                <Typography variant="h4" sx={{ mt: 1.5, mb: 0.75 }}>
                  {t(s.titleKey)}
                </Typography>

                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
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
