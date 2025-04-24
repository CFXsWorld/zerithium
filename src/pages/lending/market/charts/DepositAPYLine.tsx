import { Line, LineChart, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/Charts';
import { LendingAssetInterest } from '@/types/Lending';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useLocale } from '@/i18n';

const chartConfig = {
  views: {
    label: 'Supply Interest',
  },
  interest: {
    label: 'Interest',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const DepositAPYLine = ({ data }: { data: LendingAssetInterest[] }) => {
  const chartData = useMemo(() => {
    return (data || []).map((n) => ({
      date: dayjs.unix(Number(n.date)).format('YYYY-MM-DD'),
      interest: Number(n.deposit_interest || 0) / 100,
    }));
  }, [data]);
  const { locale } = useLocale();
  return (
    <ChartContainer
      config={chartConfig}
      className="relative aspect-auto h-[150px]  w-full"
    >
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <YAxis domain={['auto', 'dataMax + 50']} includeHidden width={0} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={4}
          minTickGap={32}
          tickFormatter={(value) => {
            return new Date(value).toLocaleDateString(locale, {
              month: 'short',
              day: 'numeric',
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="views"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString(locale, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
              }}
            />
          }
        />
        <Line
          dataKey="interest"
          type="monotone"
          stroke={`var(--zerithium-color-theme`}
          strokeWidth={1}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
};

export default DepositAPYLine;
