import { useEffect, useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import ContainerMax from '../../components/common/ContainerMax';
import Section from '../../components/common/Section';
import { useLanguage } from '../../i18n/useLanguage';
import { professionsApi } from '../../api/professionsApi';
import { getUser } from '../../auth/auth';
import paths from '../../routes/paths';

const DEFAULT_TRADE_OPTIONS = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'HVAC', 'Handyman'];

export default function BecomeAProPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const currentYear = new Date().getFullYear();
  const minBirthYear = currentYear - 16;

  const [fullName, setFullName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [trade, setTrade] = useState('');
  const [city, setCity] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [description, setDescription] = useState('');
  const [tradeOptions, setTradeOptions] = useState<string[]>(DEFAULT_TRADE_OPTIONS);

  const [submitted, setSubmitted] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

useEffect(() => {
  void professionsApi.getAll()
    .then((items) => setTradeOptions(items.map((item) => item.name)))
    .catch(() => setTradeOptions(DEFAULT_TRADE_OPTIONS));
}, []);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setSubmitted(true);

  const currentUser = getUser();
  if (!currentUser) {
    setErrorMessage(t('pleaseLogInFirst'));
    return;
  }

  const selectedTrade = trade === CUSTOM_TRADE ? customTrade.trim() : trade;
  const isValid = fullName.trim() && birthYear && selectedTrade && city.trim() && hourlyRate.trim();

    if (!isValid) return;

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await prosApi.create({
        fullName: fullName.trim(),
        email: currentUser.email,
        trade: selectedTrade,
        city: city.trim(),
        hourlyRate: Number(hourlyRate),
      });

      setSnackOpen(true);

    setFullName('');
    setBirthYear('');
    setTrade('');
    setCity('');
    setHourlyRate('');
    setDescription('');
    setSubmitted(false);
  };

  const hasError = (value: string) => submitted && !value.trim();

  const handleHourlyRateChange = (value: string) => {
    if (value === '') {
      setHourlyRate('');
      return;
    }

    const numericValue = Number(value);
    setHourlyRate(String(Math.max(0, numericValue)));
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
                'linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(124,92,255,0.12) 58%, rgba(255,255,255,0.03) 100%)',
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
              {t('becomeAProTitle')}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 700 }}>
              {t('becomeAProSubtitle')}
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
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="stretch">
                <Box
                  sx={{
                    flex: { md: '0 0 280px' },
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.035)',
                  }}
                >
                  <Typography sx={{ fontWeight: 850, fontSize: '1.15rem' }}>
                    {t('professionalProfileSection')}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
                    {t('professionalProfileSubtitle')}
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ flex: 1 }}>
                  <Stack spacing={2.5}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <TextField
                        fullWidth
                        label={t('fullName')}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={hasError(fullName)}
                        helperText={hasError(fullName) ? t('fieldRequired') : ''}
                      />

                      <FormControl fullWidth error={submitted && !birthYear}>
                        <InputLabel>{t('birthYear')}</InputLabel>
                        <Select
                          value={birthYear}
                          label={t('birthYear')}
                          onChange={(e) => setBirthYear(e.target.value)}
                        >
                          {Array.from({ length: minBirthYear - 1925 }, (_, i) => minBirthYear - i).map((year) => (
                            <MenuItem key={year} value={String(year)}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                        {submitted && !birthYear && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                            {t('fieldRequired')}
                          </Typography>
                        )}
                      </FormControl>
                    </Stack>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                      <FormControl fullWidth error={submitted && !trade}>
                        <InputLabel>{t('trade')}</InputLabel>
                        <Select
                          value={trade}
                          label={t('trade')}
                          onChange={(e) => setTrade(e.target.value)}
                        >
                          <MenuItem value="" disabled>
                            {t('selectTrade')}
                          </MenuItem>
                          {tradeOptions.map((opt) => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                          <MenuItem value={CUSTOM_TRADE}>
                            {t('otherTrade')}
                          </MenuItem>
                        </Select>
                        {submitted && !trade && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                            {t('fieldRequired')}
                          </Typography>
                        )}
                      </FormControl>

                      <TextField
                        fullWidth
                        label={t('city')}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        error={hasError(city)}
                        helperText={hasError(city) ? t('fieldRequired') : ''}
                      />
                    </Stack>

                    {isCustomTrade && (
                      <TextField
                        fullWidth
                        label={t('customTradeLabel')}
                        value={customTrade}
                        onChange={(e) => setCustomTrade(e.target.value)}
                        error={hasError(customTrade)}
                        helperText={hasError(customTrade) ? t('fieldRequired') : t('customTradeHint')}
                      />
                    )}

                    <TextField
                      fullWidth
                      label={t('hourlyRate')}
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => handleHourlyRateChange(e.target.value)}
                      error={hasError(hourlyRate)}
                      helperText={hasError(hourlyRate) ? t('fieldRequired') : ''}
                      inputProps={{ min: 0 }}
                    />

                    <TextField
                      fullWidth
                      label={t('description')}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t('descriptionPlaceholder')}
                      multiline
                      rows={4}
                    />

                    <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ alignSelf: 'flex-start', px: 3 }}>
                      {t('submitApplication')}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          message={t('applicationSuccess')}
        />

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={5000}
          onClose={() => setErrorMessage(null)}
          message={errorMessage ?? ''}
        />
      </ContainerMax>
    </Section>
  );
}
