import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Typography,
  Button,
  ToggleButton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { useNavigate, useSearchParams } from 'react-router-dom';

import ContainerMax from '../../components/common/ContainerMax';
import Section from '../../components/common/Section';
import { useLanguage } from '../../translations/LanguageContext';
import ViewProfileDialog from '../../components/findAPro/ViewProfileDialog';
import { prosApi, type ProApiDto } from '../../api/prosApi';
import { reviewsApi, type ReviewApiDto } from '../../api/reviewsApi';
import { getUser } from '../../auth/auth';
import paths from '../../routes/paths';
import { useMessagesDrawer } from '../../components/messages/MessagesDrawerContext';
import { ensureConversation } from '../../services/messagesStore';
import { professionsApi } from '../../api/professionsApi';
import type { ProProfile } from '../../types/pro';

const DEFAULT_TRADE_OPTIONS = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'HVAC', 'Handyman'];
const DEFAULT_MAX_HOURLY_RATE = 400;

function getAge(birthYear: number): number | null {
  if (!birthYear) return null;
  return new Date().getFullYear() - birthYear;
}

function mapApiProToPro(p: ProApiDto, reviews: ReviewApiDto[]): ProProfile {
  const proReviews = reviews.filter((r) => r.proId === p.id);
  const avgRating = proReviews.length > 0
    ? proReviews.reduce((acc, r) => acc + r.rating, 0) / proReviews.length
    : 0;
  return {
    id: String(p.id),
    name: p.fullName,
    age: getAge(p.birthYear),
    trade: p.trade,
    city: p.city,
    rating: avgRating,
    reviewsCount: proReviews.length,
    hourlyFrom: p.hourlyRate,
    tags: p.status === 'Verified' ? ['Verified'] : [p.status],
    description: p.description || `${p.fullName} offers ${p.trade.toLowerCase()} services in ${p.city}.`,
    reviews: proReviews.map((r) => ({
      id: String(r.id),
      author: r.reviewerName,
      rating: r.rating,
      date: r.createdAt.slice(0, 10),
      text: r.comment,
    })),
  };
}

type SortOption = 'relevance' | 'rating' | 'price_low' | 'price_high';

function getTradeFromUrl(value: string | null): string {
  return value?.trim() || 'All';
}

export default function FindAProPage() {
  const { t } = useLanguage();
  const nav = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const verifiedFromUrl = searchParams.get('verified') === 'true';
  const tradeFromUrl = searchParams.get('trade');

  const user = getUser();
  const { openDrawer } = useMessagesDrawer();

  const requireAuth = () => {
    const qs = searchParams.toString();
    const from = qs ? `${paths.findAPro}?${qs}` : paths.findAPro;
    nav(paths.login, { replace: true, state: { from } });
  };

  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [trade, setTrade] = useState<string>(() => getTradeFromUrl(tradeFromUrl));
  const [minRating, setMinRating] = useState<number>(0);
  const [priceRange, setPriceRange] = useState<number[]>([0, DEFAULT_MAX_HOURLY_RATE]);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(() => verifiedFromUrl);

  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState<ProProfile | null>(null);
  const [pros, setPros] = useState<ProProfile[]>([]);
  const [tradeOptions, setTradeOptions] = useState<string[]>(DEFAULT_TRADE_OPTIONS);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadPros = () => {
      Promise.all([
        prosApi.getAll(),
        reviewsApi.getAll().catch(() => [] as ReviewApiDto[]),
      ]).then(([prosData, reviewsData]) => {
        if (cancelled) return;
        setPros(
          prosData
            .filter((p) => p.status !== 'Suspended')
            .sort((a, b) => b.id - a.id)
            .map((p) => mapApiProToPro(p, reviewsData))
        );
        setLoadError(null);
      }).catch(() => {
        if (cancelled) return;
        setLoadError(t('couldNotLoadPros'));
      });
    };

    loadPros();
    window.addEventListener('focus', loadPros);
    document.addEventListener('visibilitychange', loadPros);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', loadPros);
      document.removeEventListener('visibilitychange', loadPros);
    };
  }, [t]);

  useEffect(() => {
    let cancelled = false;
    prosApi.getAll().then((prosData) => {
      if (cancelled) return;
      const trades = Array.from(new Set([
        ...DEFAULT_TRADE_OPTIONS,
        ...prosData.map((pro) => pro.trade).filter(Boolean),
      ]));
      setTradeOptions(trades);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    void professionsApi.getAll()
      .then((items) => {
        setTradeOptions((current) => Array.from(new Set([
          ...current,
          ...items.map((item) => item.name),
        ])));
      })
      .catch(() => setTradeOptions(DEFAULT_TRADE_OPTIONS));
  }, []);

  const toggleVerified = () => {
    const next = !verifiedOnly;
    setVerifiedOnly(next);

    const nextParams = new URLSearchParams(searchParams);
    if (next) nextParams.set('verified', 'true');
    else nextParams.delete('verified');
    setSearchParams(nextParams, { replace: true });
  };

  const openProfile = (p: ProProfile) => {
    if (!user) return requireAuth();
    setSelectedPro(p);
    setProfileOpen(true);
  };

  const closeProfile = () => {
    setProfileOpen(false);
    setSelectedPro(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const c = city.trim().toLowerCase();

    let list = pros.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.trade.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q));

      const matchCity = !c || p.city.toLowerCase().includes(c);
      const matchTrade = trade === 'All' || p.trade.toLowerCase() === trade.toLowerCase();
      const matchRating = p.rating >= minRating;
      const matchPrice = p.hourlyFrom >= priceRange[0] && p.hourlyFrom <= priceRange[1];
      const matchVerified = !verifiedOnly || p.tags.some((tag) => tag.toLowerCase() === 'verified');

      return matchQ && matchCity && matchTrade && matchRating && matchPrice && matchVerified;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'price_low') return a.hourlyFrom - b.hourlyFrom;
      if (sort === 'price_high') return b.hourlyFrom - a.hourlyFrom;

      const score = (x: ProProfile) => x.rating * 10 + Math.min(100, x.reviewsCount);
      return score(b) - score(a);
    });

    return list;
  }, [pros, query, city, trade, minRating, priceRange, sort, verifiedOnly]);

  const hourlyRateMax = useMemo(() => {
    const highestRate = pros.reduce((max, pro) => Math.max(max, pro.hourlyFrom), 200);
    return Math.max(highestRate, priceRange[1], DEFAULT_MAX_HOURLY_RATE);
  }, [priceRange, pros]);

  const clearFilters = () => {
    setQuery('');
    setCity('');
    setTrade('All');
    setMinRating(0);
    setPriceRange([0, DEFAULT_MAX_HOURLY_RATE]);
    setSort('relevance');
    setVerifiedOnly(false);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('verified');
    nextParams.delete('trade');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <Section sx={{ py: { xs: 3, md: 5 } }}>
      <ContainerMax>
        <Stack spacing={3}>
          <Box
            sx={{
              px: { xs: 2.5, md: 4 },
              py: { xs: 3, md: 4 },
              borderRadius: 3,
              border: '1px solid rgba(255,255,255,0.08)',
              background:
                'linear-gradient(135deg, rgba(124,92,255,0.14) 0%, rgba(34,197,94,0.07) 55%, rgba(255,255,255,0.03) 100%)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.22)',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.3rem', md: '3.25rem' },
                lineHeight: 1.05,
              }}
            >
              {t('findAProTitle')}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 680 }}>
              {t('findAProSubtitle')}
            </Typography>
          </Box>

          <Card
            variant="outlined"
            sx={{
              borderRadius: 3,
              borderColor: 'rgba(255,255,255,0.10)',
              background: 'rgba(14,20,37,0.78)',
              backdropFilter: 'blur(14px)',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={2.25}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    fullWidth
                    label={t('search')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label={t('city')}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t('cityPlaceholder')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationOnOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <FormControl fullWidth>
                    <InputLabel>{t('trade')}</InputLabel>
                    <Select value={trade} label={t('trade')} onChange={(e) => setTrade(e.target.value)}>
                      {['All', ...tradeOptions].map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt === 'All' ? t('all') : opt}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>

                <Divider />

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }}>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography fontWeight={650}>{t('minimumRating')}</Typography>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <StarRoundedIcon fontSize="small" />
                        <Typography>{minRating.toFixed(1)}+</Typography>
                      </Stack>
                    </Stack>
                    <Slider value={minRating} min={0} max={5} step={0.1} onChange={(_, v) => setMinRating(v as number)} />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography fontWeight={650}>{t('hourlyRateLabel')}</Typography>
                      <Typography color="text.secondary">
                        {priceRange[0]}–{priceRange[1]} €
                      </Typography>
                    </Stack>
                    <Slider
                      value={priceRange}
                      min={0}
                      max={hourlyRateMax}
                      step={1}
                      onChange={(_, v) => setPriceRange(v as number[])}
                    />
                  </Box>

                  <ToggleButton
                    value="verified"
                    selected={verifiedOnly}
                    onChange={toggleVerified}
                    sx={{ height: 56, px: 2, borderRadius: 2, whiteSpace: 'nowrap' }}
                  >
                    {t('verified')}
                  </ToggleButton>

                  <FormControl sx={{ minWidth: { xs: '100%', md: 220 } }}>
                    <InputLabel>{t('sort')}</InputLabel>
                    <Select value={sort} label={t('sort')} onChange={(e) => setSort(e.target.value as SortOption)}>
                      <MenuItem value="relevance">{t('sortRelevance')}</MenuItem>
                      <MenuItem value="rating">{t('sortRating')}</MenuItem>
                      <MenuItem value="price_low">{t('sortPriceLow')}</MenuItem>
                      <MenuItem value="price_high">{t('sortPriceHigh')}</MenuItem>
                    </Select>
                  </FormControl>

                  <Button variant="text" onClick={clearFilters} sx={{ alignSelf: { xs: 'stretch', md: 'center' } }}>
                    {t('clear')}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {loadError && (
            <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'error.main' }}>
              <CardContent>
                <Typography color="error.main">{loadError}</Typography>
              </CardContent>
            </Card>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Typography color="text.secondary">
              {filtered.length} {t('results')}{verifiedOnly ? ` • ${t('verifiedOnlyLabel')}` : ''}
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            }}
          >
            {filtered.map((p) => (
              <Card key={p.id} sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar>{p.name[0]}</Avatar>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ fontWeight: 750 }} noWrap>
                        {p.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {p.trade} • {p.city}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontWeight: 700 }}>{p.hourlyFrom}€/h</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
                    <Chip size="small" label={`⭐ ${p.rating.toFixed(1)} (${p.reviewsCount})`} variant="outlined" />
                    {p.tags.slice(0, 2).map((tag) => (
                      <Chip key={tag} size="small" label={tag} variant="outlined" />
                    ))}
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button fullWidth variant="outlined" onClick={() => openProfile(p)}>
                      {t('viewProfile')}
                    </Button>

                    <Button
                      fullWidth
                      variant="contained"
                      onClick={async () => {
                        if (!user) return requireAuth();
                        await ensureConversation(user.email, p.id, {
                          name: p.name,
                          trade: p.trade,
                          city: p.city,
                        });
                        openDrawer(p.id);
                      }}
                    >
                      {t('message')}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          {filtered.length === 0 && (
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 750 }}>{t('noResults')}</Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {t('noResultsHint')}
                </Typography>
              </CardContent>
            </Card>
          )}

          <ViewProfileDialog open={profileOpen} onClose={closeProfile} pro={selectedPro} />
        </Stack>
      </ContainerMax>
    </Section>
  );
}
