import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const VolumeBar = ({
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
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="amount" fill="#6E5DE6" radius={8} />
      </BarChart>
    </ChartContainer>
  );
};

export default VolumeBar;
