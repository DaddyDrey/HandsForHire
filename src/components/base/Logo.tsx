import { Box, Typography } from '@mui/material';

export default function Logo() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: 'linear-gradient(135deg, rgba(124,92,255,1), rgba(34,197,94,1))',
        }}
      />
      <Typography sx={{ fontWeight: 850, letterSpacing: '-0.02em' }}>
        HandsForHire
      </Typography>
    </Box>
  );
}
