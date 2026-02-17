import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import ContainerMax from '../../common/ContainerMax';
import Section from '../../common/Section';

export default function Hero() {
  return (
    <Section sx={{ pt: { xs: 8, md: 10 } }}>
      <ContainerMax>
        <Stack spacing={3} sx={{ maxWidth: 760 }}>
          <Chip
            label="Modern • Verified pros • Fast booking"
            sx={{ width: 'fit-content', border: '1px solid rgba(255,255,255,0.12)' }}
            variant="outlined"
          />

          <Typography variant="h1">
            Hire trusted pros for any repair, install, or renovation.
          </Typography>

          <Typography color="text.secondary" variant="body1">
            HandsForHire connects people with skilled craftsmen — electricians, plumbers,
            carpenters, painters and more. Browse, compare, and book in minutes.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button variant="contained" size="large">
              Find a professional
            </Button>
            <Button variant="outlined" size="large">
              Become a professional
            </Button>
          </Stack>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 2 }}>
            <Chip label="Verified profiles" variant="outlined" />
            <Chip label="Ratings & reviews" variant="outlined" />
            <Chip label="Secure payments" variant="outlined" />
          </Box>
        </Stack>
      </ContainerMax>
    </Section>
  );
}
