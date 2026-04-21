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
import { useLanguage } from '../../i18n/LanguageContext';
import ViewProfileDialog from '../../components/findAPro/ViewProfileDialog';
import { useProService, type Pro } from '../../mock_data/pros';
import { getUser } from '../../auth/auth';
import paths from '../../routes/paths';
import { useMessagesDrawer } from '../../components/messages/MessagesDrawerContext';
import { ensureConversation } from '../../mock_data/messagesStore';

const TRADE_OPTIONS = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'HVAC', 'Handyman'] as const;
type TradeOption = (typeof TRADE_OPTIONS)[number];
type SortOption = 'relevance' | 'rating' | 'price_low' | 'price_high';

export default function FindAProPage() {
  const { t } = useLanguage();
  const nav = useNavigate();
  const { getAll } = useProService();

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
  const [trade, setTrade] = useState<TradeOption>('All');
  const [minRating, setMinRating] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<number[]>([0, 30]);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(verifiedFromUrl);

  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Pro | null>(null);
  const [pros, setPros] = useState<Pro[]>([]);

  useEffect(() => {
    void getAll()
      .then(setPros)
      .catch((error) => console.error('Could not load professionals', error));
  }, [getAll]);

  useEffect(() => {
    setVerifiedOnly(verifiedFromUrl);
  }, [verifiedFromUrl]);

  useEffect(() => {
    if (!tradeFromUrl) return;
    if (TRADE_OPTIONS.includes(tradeFromUrl as TradeOption)) {
      setTrade(tradeFromUrl as TradeOption);
    }
  }, [tradeFromUrl]);

  const toggleVerified = () => {
    const next = !verifiedOnly;
    setVerifiedOnly(next);

    const nextParams = new URLSearchParams(searchParams);
    if (next) nextParams.set('verified', 'true');
    else nextParams.delete('verified');
    setSearchParams(nextParams, { replace: true });
  };

  const openProfile = (p: Pro) => {
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
      const matchTrade = trade === 'All' || p.trade === trade;
      const matchRating = p.rating >= minRating;
      const matchPrice = p.hourlyFrom >= priceRange[0] && p.hourlyFrom <= priceRange[1];
      const matchVerified = !verifiedOnly || p.tags.some((tag) => tag.toLowerCase() === 'verified');

      return matchQ && matchCity && matchTrade && matchRating && matchPrice && matchVerified;
    });

    list = [...list].sort((a, b) => {
      if (sort === 'rating') return b.rating - a.rating;
      if (sort === 'price_low') return a.hourlyFrom - b.hourlyFrom;
      if (sort === 'price_high') return b.hourlyFrom - a.hourlyFrom;

      const score = (x: Pro) => x.rating * 10 + Math.min(100, x.reviewsCount);
      return score(b) - score(a);
    });

    return list;
  }, [pros, query, city, trade, minRating, priceRange, sort, verifiedOnly]);

  const clearFilters = () => {
    setQuery('');
    setCity('');
    setTrade('All');
    setMinRating(1);
    setPriceRange([0, 30]);
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
                    <Select value={trade} label={t('trade')} onChange={(e) => setTrade(e.target.value as TradeOption)}>
                      {TRADE_OPTIONS.map((opt) => (
                        <MenuItem key={opt} value={opt}>
                          {opt === 'All' ? t('all') : t(opt.toLowerCase() as 'electrician' | 'plumber' | 'carpenter' | 'painter' | 'hvac' | 'handyman')}
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
                      max={50}
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
                      onClick={() => {
                        if (!user) return requireAuth();
                        ensureConversation(user.email, p.id, {
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
