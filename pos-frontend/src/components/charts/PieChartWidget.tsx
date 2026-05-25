import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useChartTheme } from '@/hooks/useChartTheme';
import { ChartContainer } from './ChartContainer';

interface PieChartWidgetProps {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
  height?: number;
  formatValue?: (value: number) => string;
  innerRadius?: number;
  outerRadius?: number;
  className?: string;
}

export function PieChartWidget({
  title, description, data, height = 280, formatValue,
  innerRadius = 50, outerRadius = 100, className,
}: PieChartWidgetProps) {
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
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            paddingAngle={4}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={theme.colors[i % theme.colors.length]} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
