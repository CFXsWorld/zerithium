import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import { ChartContainer, type ChartConfig } from '@/components/Charts';

const chartData = [{ rate: 400, fill: 'var(--zerithium-color-theme)' }];
const chartConfig = {
  rate: {
    label: 'rate',
  },
} satisfies ChartConfig;

const TotalSupplyPie = ({ percent = 99 }: { percent: number }) => {
  const rate = percent * 3.6;
  return (
    <ChartContainer config={chartConfig} className="h-[85px] w-[100px]">
      <RadialBarChart
        data={chartData}
        endAngle={rate}
        innerRadius={35}
        outerRadius={50}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-fill-niubi3 last:fill-fill-niubi"
          polarRadius={[38, 32]}
        />
        <RadialBar dataKey="rate" background />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="text-[12px] text-tc-secondary"
                    >
                      {percent}%
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
};

export default TotalSupplyPie;
