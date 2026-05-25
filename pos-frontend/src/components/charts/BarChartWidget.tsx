import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useChartTheme } from '@/hooks/useChartTheme';
import { ChartContainer } from './ChartContainer';

interface BarChartWidgetProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey?: string;
  layout?: 'horizontal' | 'vertical';
  height?: number;
  formatValue?: (value: number) => string;
  barColors?: string[];
  className?: string;
}

export function BarChartWidget({
  title, description, data, dataKey, nameKey = 'name',
  layout = 'horizontal', height = 280, formatValue, barColors, className,
}: BarChartWidgetProps) {
  const theme = useChartTheme();
  const colors = barColors || theme.colors;

  if (!data || data.length === 0) {
    return (
      <ChartContainer title={title} description={description} className={className}>
        <p className="text-sm text-[hsl(var(--muted-foreground))] text-center py-12">No data</p>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer title={title} description={description} className={className}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={layout} margin={layout === 'vertical' ? { left: 80 } : undefined}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
          {layout === 'vertical' ? (
            <>
              <XAxis type="number" tick={{ fontSize: 12, fill: theme.textColor }} />
              <YAxis type="category" dataKey={nameKey} tick={{ fontSize: 12, fill: theme.textColor }} width={75} />
            </>
          ) : (
            <>
              <XAxis dataKey={nameKey} tick={{ fontSize: 12, fill: theme.textColor }} />
              <YAxis tick={{ fontSize: 12, fill: theme.textColor }} />
            </>
          )}
          <Tooltip
            formatter={formatValue ? (v: number) => formatValue(v) : undefined}
            contentStyle={{
              backgroundColor: theme.tooltipBg,
              border: `1px solid ${theme.tooltipBorder}`,
              borderRadius: '0.75rem',
              color: theme.tooltipText,
              fontSize: '0.875rem',
            }}
          />
          <Legend />
          <Bar dataKey={dataKey} fill={colors[0]} radius={layout === 'vertical' ? [0, 6, 6, 0] : [6, 6, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
