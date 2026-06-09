import type { PaletteOptions } from '@mui/material/styles';

export type ThemeModeId = 'violet' | 'ocean' | 'ember' | 'forest';

export type ThemeMode = {
  id: ThemeModeId;
  name: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  background: string;
  paper: string;
  preview: string;
};

export const THEME_STORAGE_KEY = 'handsforhire_theme';
export const DEFAULT_THEME_MODE: ThemeModeId = 'violet';
export const THEME_RESET_EVENT = 'handsforhire_theme_reset';

export const themeModes: ThemeMode[] = [
  {
    id: 'violet',
    name: 'Violet',
    primary: '#7C5CFF',
    primaryLight: '#9B82FF',
    primaryDark: '#5A3ECC',
    secondary: '#22C55E',
    background: '#080C16',
    paper: '#0E1425',
    preview: 'linear-gradient(135deg, #7C5CFF 0%, #22C55E 100%)',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    primary: '#2F9BFF',
    primaryLight: '#6DBBFF',
    primaryDark: '#1765B8',
    secondary: '#14D6C7',
    background: '#06111F',
    paper: '#0B1A2D',
    preview: 'linear-gradient(135deg, #2F9BFF 0%, #14D6C7 100%)',
  },
  {
    id: 'ember',
    name: 'Ember',
    primary: '#FF6B4A',
    primaryLight: '#FF9279',
    primaryDark: '#C4452D',
    secondary: '#FFD166',
    background: '#130D12',
    paper: '#21141B',
    preview: 'linear-gradient(135deg, #FF6B4A 0%, #FFD166 100%)',
  },
  {
    id: 'forest',
    name: 'Forest',
    primary: '#2DD4BF',
    primaryLight: '#5EEAD4',
    primaryDark: '#0F766E',
    secondary: '#A3E635',
    background: '#07130F',
    paper: '#10201A',
    preview: 'linear-gradient(135deg, #2DD4BF 0%, #A3E635 100%)',
  },
];

export function getThemeMode(id: string | null): ThemeMode {
  return themeModes.find((mode) => mode.id === id) ?? themeModes.find((mode) => mode.id === DEFAULT_THEME_MODE) ?? themeModes[0];
}

export function paletteForMode(mode: ThemeMode): PaletteOptions {
  return {
    mode: 'dark',
    primary: { main: mode.primary, light: mode.primaryLight, dark: mode.primaryDark },
    secondary: { main: mode.secondary },
    background: {
      default: mode.background,
      paper: mode.paper,
    },
    text: {
      primary: '#F0F4FF',
      secondary: '#8B95B0',
    },
    divider: 'rgba(255,255,255,0.07)',
  };
}
