import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useChartTheme } from '@/hooks/useChartTheme';
import { ChartContainer } from './ChartContainer';

interface LineChartWidgetProps {
  title: string;
  description?: string;
  data: Record<string, unknown>[];
  lines: { dataKey: string; label?: string; colorIndex?: number }[];
  nameKey?: string;
  height?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function LineChartWidget({
  title, description, data, lines, nameKey = 'name',
  height = 280, formatValue, className,
}: LineChartWidgetProps) {
  const theme = useChartTheme();

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
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.gridColor} />
          <XAxis dataKey={nameKey} tick={{ fontSize: 12, fill: theme.textColor }} />
          <YAxis tick={{ fontSize: 12, fill: theme.textColor }} />
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
          {lines.map(({ dataKey, label, colorIndex = 0 }) => (
            <Line
              key={dataKey}
              type="monotone"
              dataKey={dataKey}
              name={label || dataKey}
              stroke={theme.colors[colorIndex % theme.colors.length]}
              strokeWidth={2}
              dot={{ fill: theme.colors[colorIndex % theme.colors.length], r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
