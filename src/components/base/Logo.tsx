import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function Logo() {
  return (
    <Box
      component={RouterLink}
      to="/"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        transition: '0.2s ease',

        '&:hover .logoOverlay': {
          opacity: 0.7,
        },

        '&:hover .logoIcon': {
          opacity: 1,
          transform: 'scale(1)',
        },
      }}
    >
      {/* 🔹 LOGO IMAGE */}
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >

        <Box
          component="img"
          src="/logo.png"   // ← dacă redenumești fișierul, modifici doar aici
          alt="HandsForHire Logo"
          sx={{
            width: '225%',
            height: '225%',
            objectFit: 'contain',
          }}
        />

        {/* 🔹 Cover alb pe hover */}
        <Box
          className="logoOverlay"
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: '#fff',
            opacity: 0,
            transition: 'opacity 160ms ease',
            pointerEvents: 'none',
          }}
        />

        {/* 🔹 Icon Home pe hover */}
        <Box
          className="logoIcon"
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            opacity: 0,
            transform: 'scale(0.9)',
            transition: 'opacity 160ms ease, transform 160ms ease',
            pointerEvents: 'none',
          }}
        >
          <HomeRoundedIcon sx={{ fontSize: 18, color: 'rgba(0,0,0,0.9)' }} />
        </Box>
      </Box>

      <Typography sx={{ fontWeight: 850, letterSpacing: '-0.02em' }}>
        HandsForHire
      </Typography>
    </Box>
  );
}