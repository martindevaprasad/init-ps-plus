import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';
import { useTheme } from './ThemeProvider';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      const idx = order.indexOf(theme);
      setTheme(order[(idx + 1) % order.length]);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const order: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
      const idx = order.indexOf(theme);
      setTheme(order[(idx - 1 + order.length) % order.length]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          id="theme-switcher"
          data-tour="theme-switcher"
          onKeyDown={handleKeyDown}
          aria-label={`Current theme: ${theme}. Press arrow keys to cycle themes.`}
          className="relative"
        >
          <IconSun
            className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
              resolvedTheme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
            }`}
            style={{ position: resolvedTheme === 'dark' ? 'absolute' : 'relative' }}
          />
          <IconMoon
            className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
              resolvedTheme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
            }`}
            style={{ position: resolvedTheme === 'light' ? 'absolute' : 'relative' }}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
          <IconSun className="h-4 w-4" />
          Light
          {theme === 'light' && <span className="ml-auto text-xs text-[hsl(var(--primary))]">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
          <IconMoon className="h-4 w-4" />
          Dark
          {theme === 'dark' && <span className="ml-auto text-xs text-[hsl(var(--primary))]">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
          <IconDeviceDesktop className="h-4 w-4" />
          System
          {theme === 'system' && <span className="ml-auto text-xs text-[hsl(var(--primary))]">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
