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
import { useSearchParams } from 'react-router-dom';

import ContainerMax from '../../components/common/ContainerMax';
import Section from '../../components/common/Section';
import { useLanguage } from '../../i18n/LanguageContext';

import ViewProfileDialog from '../../components/findAPro/ViewProfileDialog';
import { MOCK_PROS, type Pro } from '../../mock_data/pros';

import MessageDialog from '../../components/findAPro/MessageDialog';

const TRADE_OPTIONS = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'HVAC', 'Handyman'] as const;
type TradeOption = (typeof TRADE_OPTIONS)[number];

type SortOption = 'relevance' | 'rating' | 'price_low' | 'price_high';

export default function FindAProPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const verifiedFromUrl = searchParams.get('verified') === 'true';

  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [trade, setTrade] = useState<TradeOption>('All');
  const [minRating, setMinRating] = useState<number>(1);
  const [priceRange, setPriceRange] = useState<number[]>([0, 30]);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(verifiedFromUrl);

  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedPro, setSelectedPro] = useState<Pro | null>(null);

  const [messageOpen, setMessageOpen] = useState(false);
  const [messagePro, setMessagePro] = useState<Pro | null>(null);

  const openMessage = (p: Pro) => {
    setMessagePro(p);
    setMessageOpen(true);
  };

  const closeMessage = () => {
    setMessageOpen(false);
    setMessagePro(null);
  };

  useEffect(() => {
    setVerifiedOnly(verifiedFromUrl);
  }, [verifiedFromUrl]);

  const toggleVerified = () => {
    const next = !verifiedOnly;
    setVerifiedOnly(next);

    const nextParams = new URLSearchParams(searchParams);
    if (next) nextParams.set('verified', 'true');
    else nextParams.delete('verified');
    setSearchParams(nextParams, { replace: true });
  };

  const openProfile = (p: Pro) => {
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

    let list = MOCK_PROS.filter((p) => {
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
  }, [query, city, trade, minRating, priceRange, sort, verifiedOnly]);

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
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <Section sx={{ py: { xs: 4, md: 6 } }}>
      <ContainerMax>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3rem' } }}>
              {t('findAProTitle')}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {t('findAProSubtitle')}
            </Typography>
          </Box>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack spacing={2}>
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
                    <Button fullWidth variant="contained" onClick={() => openMessage(p)}>
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
          <MessageDialog open={messageOpen} onClose={closeMessage} pro={messagePro} />
        </Stack>
      </ContainerMax>
    </Section>
  );
}
