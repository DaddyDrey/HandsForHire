import { Box, Card, CardContent, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { TranslationKey } from '../../../i18n/translations';

const quotes: { textKey: TranslationKey; author: string }[] = [
  { textKey: 'testimonial1', author: 'Dana' },
  { textKey: 'testimonial2', author: 'Vlad' },
  { textKey: 'testimonial3', author: 'Elena' },
];

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 3 }}>
          {t('peopleLoveIt')}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {quotes.map((q) => (
            <Card key={q.author}>
              <CardContent>
                <Typography sx={{ mb: 2 }}>"{t(q.textKey)}"</Typography>
                <Typography variant="body2" color="text.secondary">
                  — {q.author}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
