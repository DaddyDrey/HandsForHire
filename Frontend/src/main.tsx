import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import './styles/globals.css';
import router from './routes/router';
import { LanguageProvider } from './translations/LanguageContext';
import { AxiosProvider } from './api/AxiosProvider';
import { AppThemeProvider } from './theme/AppThemeProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppThemeProvider>
      <LanguageProvider>
        <AxiosProvider>
          <RouterProvider router={router} />
        </AxiosProvider>
      </LanguageProvider>
    </AppThemeProvider>
  </React.StrictMode>
);
