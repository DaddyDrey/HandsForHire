import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Card, CardContent, Chip, Stack, Typography, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../translations/useLanguage';
import { prosApi, type ProApiDto } from '../../../api/prosApi';
import { reviewsApi, type ReviewApiDto } from '../../../api/reviewsApi';

const COLORS = ['#7C5CFF', '#22C55E', '#F59E0B'];

type Featured = {
  id: number;
  name: string;
  trade: string;
  rating: number;
  reviewsCount: number;
  status: string;
  color: string;
};

export default function FeaturedPros() {
  const { t } = useLanguage();
  const [pros, setPros] = useState<ProApiDto[]>([]);
  const [reviews, setReviews] = useState<ReviewApiDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      prosApi.getAll().catch(() => [] as ProApiDto[]),
      reviewsApi.getAll().catch(() => [] as ReviewApiDto[]),
    ]).then(([prosData, reviewsData]) => {
      if (cancelled) return;
      setPros(prosData);
      setReviews(reviewsData);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const featured: Featured[] = useMemo(() => {
    const enriched = pros.map((p, idx) => {
      const proReviews = reviews.filter((r) => r.proId === p.id);
      const avgRating = proReviews.length > 0
        ? proReviews.reduce((acc, r) => acc + r.rating, 0) / proReviews.length
        : 0;
      return {
        id: p.id,
        name: p.fullName,
        trade: p.trade,
        rating: avgRating,
        reviewsCount: proReviews.length,
        status: p.status,
        color: COLORS[idx % COLORS.length],
      };
    });
    return enriched
      .sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount)
      .slice(0, 3);
  }, [pros, reviews]);

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
            label={`✓ ${t('verifiedProfiles')}`}
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : featured.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>—</Typography>
        ) : (
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
            {featured.map((p) => (
              <Card
                key={p.id}
                component={RouterLink}
                to={`/pros/${p.id}/reviews`}
                sx={{
                  background: 'rgba(255,255,255,0.03)',
                  textDecoration: 'none',
                  color: 'inherit',
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
                      {p.name[0]?.toUpperCase() ?? '?'}
                    </Avatar>

                    <Stack spacing={0.4} flex={1} sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 750 }} noWrap>{p.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {p.trade} · ⭐ {p.rating > 0 ? p.rating.toFixed(1) : '—'} ({p.reviewsCount})
                      </Typography>
                    </Stack>

                    {p.status === 'Verified' && (
                      <Chip
                        label={t('verified')}
                        size="small"
                        sx={{
                          borderColor: `${p.color}55`,
                          color: p.color,
                          background: `${p.color}0F`,
                        }}
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </ContainerMax>
    </Section>
  );
}
