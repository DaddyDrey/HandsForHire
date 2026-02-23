import { useState, type FormEvent } from 'react';
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

import ContainerMax from '../../components/common/ContainerMax';
import Section from '../../components/common/Section';
import { useLanguage } from '../../i18n/LanguageContext';

const TRADE_OPTIONS = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'HVAC', 'Handyman'] as const;

export default function BecomeAProPage() {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [trade, setTrade] = useState('');
  const [city, setCity] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [description, setDescription] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const isValid = fullName.trim() && age.trim() && trade && city.trim() && hourlyRate.trim();
    if (!isValid) return;

    setSnackOpen(true);

    setFullName('');
    setAge('');
    setTrade('');
    setCity('');
    setHourlyRate('');
    setDescription('');
    setSubmitted(false);
  };

  const hasError = (value: string) => submitted && !value.trim();

  return (
    <Section sx={{ py: { xs: 4, md: 6 } }}>
      <ContainerMax>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.2rem', md: '3rem' } }}>
              {t('becomeAProTitle')}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {t('becomeAProSubtitle')}
            </Typography>
          </Box>

          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit} noValidate>
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

                    <TextField
                      fullWidth
                      label={t('age')}
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      error={hasError(age)}
                      helperText={hasError(age) ? t('fieldRequired') : ''}
                    />
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
                        {TRADE_OPTIONS.map((opt) => (
                          <MenuItem key={opt} value={opt}>
                            {t(opt.toLowerCase() as 'electrician' | 'plumber' | 'carpenter' | 'painter' | 'hvac' | 'handyman')}
                          </MenuItem>
                        ))}
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

                  <TextField
                    fullWidth
                    label={t('hourlyRate')}
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    error={hasError(hourlyRate)}
                    helperText={hasError(hourlyRate) ? t('fieldRequired') : ''}
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

                  <Button type="submit" variant="contained" size="large" sx={{ alignSelf: 'flex-start' }}>
                    {t('submitApplication')}
                  </Button>
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Stack>

        <Snackbar
          open={snackOpen}
          autoHideDuration={4000}
          onClose={() => setSnackOpen(false)}
          message={t('applicationSuccess')}
        />
      </ContainerMax>
    </Section>
  );
}
