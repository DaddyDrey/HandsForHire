import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../i18n/LanguageContext';
import type { TranslationKey } from '../../../i18n/translations';

const pros: { name: string; roleKey: TranslationKey; rating: string; tagKey: TranslationKey }[] = [
  { name: 'Alex M.', roleKey: 'electrician', rating: '4.9', tagKey: 'verified' },
  { name: 'Irina P.', roleKey: 'plumber', rating: '4.8', tagKey: 'topRated' },
  { name: 'Mihai C.', roleKey: 'carpenter', rating: '4.9', tagKey: 'fastResponse' },
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
          sx={{ mb: 3, gap: 1 }}
        >
          <Typography variant="h2">{t('featuredProfessionals')}</Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label="Verified profiles"
              component={RouterLink}
              to="/pros?verified=true"
              clickable
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
            <Typography color="text.secondary">{t('handPickedReviews')}</Typography>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {pros.map((p) => (
            <Card key={p.name}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar>{p.name[0]}</Avatar>

                  <Stack spacing={0.5}>
                    <Typography sx={{ fontWeight: 750 }}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t(p.roleKey)} • ⭐ {p.rating}
                    </Typography>
                  </Stack>

                  <Chip label={t(p.tagKey)} size="small" sx={{ ml: 'auto' }} variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </ContainerMax>
    </Section>
  );
}