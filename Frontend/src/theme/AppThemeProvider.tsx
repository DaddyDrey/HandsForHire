import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';

import typography from './typography';
import components from './components';
import {
  getThemeMode,
  paletteForMode,
  THEME_STORAGE_KEY,
  themeModes,
  type ThemeMode,
  type ThemeModeId,
} from './themeModes';

type AppThemeContextValue = {
  mode: ThemeMode;
  modes: ThemeMode[];
  setMode: (id: ThemeModeId) => void;
};

const AppThemeContext = createContext<AppThemeContextValue | null>(null);

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [modeId, setModeId] = useState<ThemeModeId>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return getThemeMode(stored).id;
  });

  const mode = getThemeMode(modeId);

  const theme = useMemo(
    () => createTheme({
      palette: paletteForMode(mode),
      typography,
      shape: { borderRadius: 14 },
      components,
    }),
    [mode]
  );

  const value = useMemo<AppThemeContextValue>(() => ({
    mode,
    modes: themeModes,
    setMode: (id) => {
      localStorage.setItem(THEME_STORAGE_KEY, id);
      setModeId(id);
    },
  }), [mode]);

  return (
    <AppThemeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(AppThemeContext);
  if (!context) throw new Error('useAppTheme must be used within AppThemeProvider');
  return context;
}
