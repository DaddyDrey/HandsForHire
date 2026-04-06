import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { TranslationKey } from '../../../i18n/translations';

const pros: { name: string; roleKey: TranslationKey; rating: string; tagKey: TranslationKey; color: string }[] = [
  { name: 'Alex M.', roleKey: 'electrician', rating: '4.9', tagKey: 'verified', color: '#7C5CFF' },
  { name: 'Irina P.', roleKey: 'plumber', rating: '4.8', tagKey: 'topRated', color: '#22C55E' },
  { name: 'Mihai C.', roleKey: 'carpenter', rating: '4.9', tagKey: 'fastResponse', color: '#F59E0B' },
];

export default function FeaturedPros() {
  const { t } = useLanguage();

  return (
    <Section>
      <ContainerMax>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'baseline' }}
          sx={{ mb: 3.5, gap: 1 }}
        >
          <Box>
            <Typography variant="h2" sx={{ mb: 0.5 }}>{t('featuredProfessionals')}</Typography>
            <Typography color="text.secondary">{t('handPickedReviews')}</Typography>
          </Box>

          <Chip
            label="✓ Verified profiles"
            component={RouterLink}
            to="/pros?verified=true"
            clickable
            variant="outlined"
            sx={{
              borderColor: 'rgba(34,197,94,0.4)',
              color: '#4ADE80',
              background: 'rgba(34,197,94,0.08)',
              '&:hover': { background: 'rgba(34,197,94,0.14)' },
            }}
          />
        </Stack>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          {pros.map((p) => (
            <Card
              key={p.name}
              sx={{
                background: 'rgba(255,255,255,0.03)',
                transition: 'transform 160ms ease, box-shadow 160ms ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 24px ${p.color}20`,
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    sx={{
                      width: 46,
                      height: 46,
                      background: `linear-gradient(135deg, ${p.color}CC, ${p.color}66)`,
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      border: `2px solid ${p.color}44`,
                    }}
                  >
                    {p.name[0]}
                  </Avatar>

                  <Stack spacing={0.4} flex={1}>
                    <Typography sx={{ fontWeight: 750 }}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(p.roleKey)} · ⭐ {p.rating}
                    </Typography>
                  </Stack>

                  <Chip
                    label={t(p.tagKey)}
                    size="small"
                    sx={{
                      borderColor: `${p.color}55`,
                      color: p.color,
                      background: `${p.color}0F`,
                    }}
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}
