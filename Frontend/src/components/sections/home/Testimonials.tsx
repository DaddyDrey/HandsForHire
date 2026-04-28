import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../translations/useLanguage';
import { reviewsApi, type ReviewApiDto } from '../../../api/reviewsApi';

export default function Testimonials() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewApiDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    reviewsApi.getAll()
      .then((data) => {
        if (cancelled) return;
        const sorted = [...data]
          .filter((r) => r.comment && r.comment.trim().length > 0)
          .sort((a, b) => b.rating - a.rating || b.createdAt.localeCompare(a.createdAt))
          .slice(0, 3);
        setReviews(sorted);
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <Section>
      <ContainerMax>
        <Typography variant="h2" sx={{ mb: 1 }}>
          {t('peopleLoveIt')}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3.5 }}>
          {t('handPickedReviews')}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            {t('noReviewsYet')}
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
            {reviews.map((r) => (
              <Card
                key={r.id}
                sx={{
                  background: 'rgba(255,255,255,0.03)',
                  transition: 'transform 160ms ease',
                  '&:hover': { transform: 'translateY(-2px)' },
                }}
              >
                <CardContent sx={{ p: 3 }}>
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
                    {r.comment}
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
                      {(r.reviewerName?.[0] ?? r.reviewerEmail?.[0] ?? '?').toUpperCase()}
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        {r.reviewerName || r.reviewerEmail}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.78rem' }}>
                        ⭐ {r.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </ContainerMax>
    </Section>
  );
}
