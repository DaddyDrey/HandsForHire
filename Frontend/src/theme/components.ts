import type { Components, Theme } from '@mui/material/styles';

const components: Components<Theme> = {
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        border: '1px solid rgba(255,255,255,0.08)',
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        border: '1px solid rgba(255,255,255,0.08)',
      },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { borderRadius: 12, paddingInline: 14, paddingBlock: 10 },
    },
  },
  MuiTextField: {
    defaultProps: { size: 'medium' },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
      },
    },
  },
};

export default components;
