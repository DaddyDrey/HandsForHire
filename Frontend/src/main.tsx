import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import './styles/globals.css';
import theme from './theme';
import router from './routes/router';
import { LanguageProvider } from './translations/LanguageContext';
import { AxiosProvider } from './api/AxiosProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
      <AxiosProvider>
      <RouterProvider router={router} />
      </AxiosProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
