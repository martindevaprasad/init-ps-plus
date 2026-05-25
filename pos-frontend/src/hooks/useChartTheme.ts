import { useMemo } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';

export function useChartTheme() {
  const { resolvedTheme } = useTheme();

  return useMemo(() => {
    const isDark = resolvedTheme === 'dark';
    return {
      colors: [
        isDark ? 'hsl(152, 55%, 50%)' : 'hsl(152, 60%, 35%)',
        isDark ? 'hsl(48, 90%, 60%)' : 'hsl(48, 96%, 53%)',
        isDark ? 'hsl(215, 70%, 65%)' : 'hsl(215, 70%, 55%)',
        isDark ? 'hsl(280, 65%, 65%)' : 'hsl(280, 65%, 55%)',
        isDark ? 'hsl(340, 75%, 65%)' : 'hsl(340, 75%, 55%)',
        isDark ? 'hsl(16, 85%, 65%)' : 'hsl(16, 85%, 55%)',
      ],
      gridColor: isDark ? 'hsl(150, 10%, 20%)' : 'hsl(214, 32%, 91%)',
      textColor: isDark ? 'hsl(150, 5%, 60%)' : 'hsl(215, 16%, 47%)',
      tooltipBg: isDark ? 'hsl(150, 10%, 12%)' : 'hsl(0, 0%, 100%)',
      tooltipBorder: isDark ? 'hsl(150, 10%, 20%)' : 'hsl(150, 10%, 90%)',
      tooltipText: isDark ? 'hsl(150, 5%, 95%)' : 'hsl(150, 10%, 10%)',
      isDark,
    };
  }, [resolvedTheme]);
}
