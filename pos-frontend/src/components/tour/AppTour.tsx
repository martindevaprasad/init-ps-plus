import { useState, useEffect } from 'react';
import { Joyride, STATUS, type Events } from 'react-joyride';
import { tourSteps } from './tourSteps';
import { useTheme } from '@/components/theme/ThemeProvider';

const TOUR_STORAGE_KEY = 'pos-tour-completed';

export function AppTour() {
  const [run, setRun] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const completed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!completed) {
      const timer = setTimeout(() => setRun(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEvent = (event: { type: Events; status: string }) => {
    if (event.status === STATUS.FINISHED || event.status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    }
  };

  return (
    <Joyride
      steps={tourSteps}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleEvent as any}
      locale={{
        back: 'Back',
        close: 'Got it',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip Tour',
      }}
      styles={{
        tooltip: {
          borderRadius: '1rem',
          padding: '1.25rem',
          backgroundColor: isDark ? 'hsl(150, 10%, 10%)' : '#fff',
          color: isDark ? 'hsl(150, 5%, 95%)' : 'hsl(150, 10%, 10%)',
        },
        tooltipContent: {
          padding: '0.5rem 0',
        },
        buttonNext: {
          borderRadius: '0.75rem',
          padding: '0.5rem 1.25rem',
          fontSize: '0.875rem',
          fontWeight: 600,
          backgroundColor: 'hsl(152, 60%, 35%)',
        },
        buttonBack: {
          borderRadius: '0.75rem',
          padding: '0.5rem 1.25rem',
          fontSize: '0.875rem',
          color: isDark ? 'hsl(150, 5%, 60%)' : 'hsl(215, 16%, 47%)',
        },
        buttonSkip: {
          borderRadius: '0.75rem',
          fontSize: '0.8125rem',
          color: isDark ? 'hsl(150, 5%, 50%)' : 'hsl(215, 16%, 47%)',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      } as any}
    />
  );
}

export function restartTour() {
  localStorage.removeItem(TOUR_STORAGE_KEY);
  window.location.reload();
}
