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
        gap: 1.15,
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        transition: '0.2s ease',

        '&:hover .logoMark': {
          transform: 'scale(1.04)',
        },

        '&:hover .logoIcon': {
          opacity: 1,
          transform: 'scale(1)',
        },
      }}
    >
      <Box
        className="logoMark"
        sx={{
          width: 32,
          height: 32,
          borderRadius: '10px',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 160ms ease',
        }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="HandsForHire Logo"
          sx={{
            width: '315%',
            height: '315%',
            objectFit: 'contain',
            flexShrink: 0,
          }}
        />

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
            bgcolor: 'rgba(240,244,255,0.92)',
          }}
        >
          <HomeRoundedIcon sx={{ fontSize: 18, color: 'rgba(8,12,22,0.92)' }} />
        </Box>
      </Box>

      <Typography sx={{ fontWeight: 900, letterSpacing: 0, lineHeight: 1 }}>
        HandsForHire
      </Typography>
    </Box>
  );
}
