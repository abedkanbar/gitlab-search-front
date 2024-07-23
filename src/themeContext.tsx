import React, { createContext, useState, useMemo, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import { LocalStorageConstants } from './local-storage-constants';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProviderComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
  const storedMode = LocalStorageConstants.getString(LocalStorageConstants.ThemeUserPreference) as PaletteMode | null;
  const [mode, setMode] = useState<PaletteMode>(storedMode || 'light');

  useEffect(() => {
    LocalStorageConstants.setItem(LocalStorageConstants.ThemeUserPreference, mode);
  }, [mode]);

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: {
              light: '#757ce8',
              main: '#3f50b5',
              dark: '#002884',
              contrastText: '#fff',
            },
            secondary: {
              light: '#ff7961',
              main: '#f44336',
              dark: '#ba000d',
              contrastText: '#000',
            },
          }
        : {
            primary: {
              light: '#757ce8',
              main: '#3f50b5',
              dark: '#002884',
              contrastText: '#fff',
            },
            secondary: {
              light: '#ff7961',
              main: '#f44336',
              dark: '#ba000d',
              contrastText: '#000',
            },
            background: {
              default: grey[900],
              paper: grey[900],
            },
            text: {
              primary: grey[100],
              secondary: grey[500],
            }
          }),
    },
  });

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeProviderComponent, ThemeContext };
