import { Area, AreaChart, XAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/Charts';
import { Recently, TokenTVL } from '@/types/explore';
import { useMemo } from 'react';
import { formatUnits } from 'ethers';
import dayjs from 'dayjs';

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const getFormatter = (recently?: Recently) => {
  switch (recently) {
    case Recently.day:
    case Recently.weekly:
      return 'YYYY-MM-DD HH';
    case Recently.monthly:
      return 'YYYY-MM-DD';
    case Recently.year:
      return 'YYYY-MM-DD';
    default:
      return 'YYYY-MM-DD';
  }
};
const TVLLinear = ({
  data,
  recently,
}: {
  data: TokenTVL[];
  recently?: Recently;
}) => {
  const chartData = useMemo(() => {
    const formatter = getFormatter(recently);
    return (data || []).map((n) => ({
      date: dayjs.unix(n.date).format(formatter),
      amount: Number(formatUnits(n.amount || 0n)),
    }));
  }, [data]);

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey="amount"
          type="linear"
          fill="rgba(110, 93, 230, 0.4)"
          fillOpacity={0.4}
          stroke="#6E5DE6"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default TVLLinear;
