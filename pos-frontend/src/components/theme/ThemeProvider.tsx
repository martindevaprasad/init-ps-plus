import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeColors {
  primary?: string;
  accent?: string;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: ThemeColors;
  setCustomColors: (colors: ThemeColors) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'light',
  setTheme: () => null,
  customColors: {},
  setCustomColors: () => null,
  resolvedTheme: 'light',
});

function getSystemTheme(): 'dark' | 'light' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'pos-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [customColors, setCustomColorsState] = useState<ThemeColors>(() => {
    const stored = localStorage.getItem(`${storageKey}-colors`);
    return stored ? JSON.parse(stored) : {};
  });

  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (customColors.primary) {
      root.style.setProperty('--primary', customColors.primary);
      root.style.setProperty('--ring', customColors.primary);
    } else {
      root.style.removeProperty('--primary');
      root.style.removeProperty('--ring');
    }
    if (customColors.accent) {
      root.style.setProperty('--accent', customColors.accent);
    } else {
      root.style.removeProperty('--accent');
    }
  }, [customColors]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(getSystemTheme());
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setThemeState(newTheme);
  };

  const setCustomColors = (colors: ThemeColors) => {
    localStorage.setItem(`${storageKey}-colors`, JSON.stringify(colors));
    setCustomColorsState(colors);
  };

  return (
    <ThemeProviderContext.Provider
      value={{ theme, setTheme, customColors, setCustomColors, resolvedTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
