import { Box, Card, CardContent, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../translations/useLanguage';
import type { TranslationKey } from '../../../translations/translations';

const quotes: { textKey: TranslationKey; author: string; role: string }[] = [
  { textKey: 'testimonial1', author: 'Dana', role: 'Homeowner' },
  { textKey: 'testimonial2', author: 'Vlad', role: 'Property Manager' },
  { textKey: 'testimonial3', author: 'Elena', role: 'Freelancer' },
];

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 1 }}>
          {t('peopleLoveIt')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3.5 }}>
          Real stories from real customers.
        </Typography>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          {quotes.map((q) => (
            <Card
              key={q.author}
              sx={{
                background: 'rgba(255,255,255,0.03)',
                transition: 'transform 160ms ease',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Decorative quote mark */}
                <Typography
                  sx={{
                    fontSize: '3.5rem',
                    lineHeight: 0.8,
                    mb: 1.5,
                    color: '#7C5CFF',
                    opacity: 0.5,
                    fontFamily: 'Georgia, serif',
                    userSelect: 'none',
                  }}
                >
                  "
                </Typography>

                <Typography
                  sx={{
                    mb: 2.5,
                    lineHeight: 1.75,
                    color: 'text.primary',
                    fontStyle: 'italic',
                  }}
                >
                  {t(q.textKey)}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7C5CFF, #9B82FF)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      color: 'white',
                    }}
                  >
                    {q.author[0]}
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {q.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                      {q.role}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
