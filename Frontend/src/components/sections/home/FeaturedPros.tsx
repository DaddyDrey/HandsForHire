import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';
import { useLanguage } from '../../../translations/useLanguage';
import { announcementsApi, type AnnouncementApiDto } from '../../../api/announcementsApi';

const COLORS = ['#7C5CFF', '#22C55E', '#F59E0B'];

export default function FeaturedJobs() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState<AnnouncementApiDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    announcementsApi.getAll()
      .then((data) => {
        if (!cancelled) setJobs(data);
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const featured = useMemo(
    () => jobs
      .filter((job) => job.status === 'Open')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
    [jobs]
  );

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
            label={t('statusOpen')}
            variant="outlined"
            sx={{
              borderColor: 'rgba(34,197,94,0.4)',
              color: '#4ADE80',
              background: 'rgba(34,197,94,0.08)',
            }}
          />
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : featured.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>{t('noJobsYet')}</Typography>
        ) : (
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
            {featured.map((job, index) => {
              const color = COLORS[index % COLORS.length];

              return (
                <Card
                  key={job.id}
                  sx={{
                    background: 'rgba(255,255,255,0.03)',
                    color: 'inherit',
                    transition: 'transform 160ms ease, box-shadow 160ms ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${color}20`,
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1.75}>
                      <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            borderRadius: '50%',
                            display: 'grid',
                            placeItems: 'center',
                            background: `linear-gradient(135deg, ${color}CC, ${color}66)`,
                            border: `2px solid ${color}44`,
                            flexShrink: 0,
                          }}
                        >
                          <WorkOutlineRoundedIcon />
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontWeight: 750 }} noWrap>{job.title}</Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {job.category}
                          </Typography>
                        </Box>

                        <Chip
                          label={t('statusOpen')}
                          size="small"
                          sx={{
                            borderColor: `${color}55`,
                            color,
                            background: `${color}0F`,
                          }}
                          variant="outlined"
                        />
                      </Stack>

                      <Typography
                        color="text.secondary"
                        variant="body2"
                        sx={{
                          minHeight: 40,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {job.description}
                      </Typography>

                      <Box sx={{ display: 'grid', gap: 1 }}>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', minWidth: 0 }}>
                          <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
                          <Typography variant="body2" noWrap>{job.city || job.authorName}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', minWidth: 0 }}>
                          <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />
                          <Typography variant="body2" noWrap>{new Date(job.createdAt).toLocaleDateString()}</Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </ContainerMax>
    </Section>
  );
}
