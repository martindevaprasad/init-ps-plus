import { useState } from 'react';
import { IconPalette, IconRefresh } from '@tabler/icons-react';
import { useTheme } from './ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from '@/components/ui/dialog';

const PRESET_PRIMARIES = [
  { label: 'Forest Green', value: '152 60% 28%' },
  { label: 'Ocean Blue', value: '215 70% 40%' },
  { label: 'Royal Purple', value: '280 65% 40%' },
  { label: 'Crimson', value: '0 72% 40%' },
  { label: 'Teal', value: '180 55% 35%' },
  { label: 'Slate', value: '215 25% 35%' },
];

const PRESET_ACCENTS = [
  { label: 'Gold', value: '48 96% 53%' },
  { label: 'Coral', value: '16 85% 60%' },
  { label: 'Lime', value: '84 80% 45%' },
  { label: 'Sky', value: '200 90% 55%' },
  { label: 'Rose', value: '340 80% 55%' },
  { label: 'Amber', value: '38 92% 50%' },
];

export function ThemeCustomizer() {
  const { customColors, setCustomColors } = useTheme();
  const [open, setOpen] = useState(false);

  const resetColors = () => {
    setCustomColors({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Customize theme">
          <IconPalette className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
          <DialogDescription>Choose your preferred primary and accent colors.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Primary Color */}
          <div>
            <h4 className="text-sm font-medium mb-3">Primary Color</h4>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_PRIMARIES.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setCustomColors({ ...customColors, primary: value })}
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all text-left ${
                    customColors.primary === value
                      ? 'border-[hsl(var(--ring))] bg-[hsl(var(--muted))]'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--ring))]/50'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0"
                    style={{ backgroundColor: `hsl(${value})` }}
                  />
                  <span className="text-xs font-medium truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <h4 className="text-sm font-medium mb-3">Accent Color</h4>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_ACCENTS.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setCustomColors({ ...customColors, accent: value })}
                  className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all text-left ${
                    customColors.accent === value
                      ? 'border-[hsl(var(--ring))] bg-[hsl(var(--muted))]'
                      : 'border-[hsl(var(--border))] hover:border-[hsl(var(--ring))]/50'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full shrink-0"
                    style={{ backgroundColor: `hsl(${value})` }}
                  />
                  <span className="text-xs font-medium truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 rounded-xl bg-[hsl(var(--muted))] space-y-2">
            <h4 className="text-sm font-medium mb-2">Preview</h4>
            <div className="flex gap-2">
              <div className="h-8 flex-1 rounded-lg bg-[hsl(var(--primary))]" />
              <div className="h-8 flex-1 rounded-lg bg-[hsl(var(--accent))]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={resetColors} className="gap-2">
            <IconRefresh className="h-4 w-4" />
            Reset to Default
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
