"use client"

import * as React from "react"
import { XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import mockDataJson from "@/mock.json"
import type { MockData } from "@/types/dashboard"

const mockData = mockDataJson as MockData

type ChartDataPoint = {
  date: string
  value: number
}

const accuracyConfig = {
  value: {
    label: "Accuracy",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const lossConfig = {
  value: {
    label: "Loss",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function DashboardChart() {
  const [activeTab, setActiveTab] = React.useState<string>("accuracy")

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const formatYAxisValue = (value: number) => {
    if (value === 0) {
      return ""
    }

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  const renderChart = (
    data: ChartDataPoint[],
    config: ChartConfig,
    fillId: string,
    colorVar: string,
    yAxisDomain: [number, number],
  ) => {
    return (
      <div className="bg-accent rounded-lg p-3">
        <ChartContainer className="md:aspect-[3/1] w-full" config={config}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: -12,
              right: 12,
              top: 12,
              bottom: 12,
            }}
          >
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colorVar} stopOpacity={0.8} />
                <stop offset="95%" stopColor={colorVar} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              horizontal={false}
              strokeDasharray="8 8"
              strokeWidth={2}
              stroke="var(--muted-foreground)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={12}
              strokeWidth={1.5}
              className="uppercase text-sm fill-muted-foreground"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              tickCount={6}
              className="text-sm fill-muted-foreground"
              tickFormatter={formatYAxisValue}
              domain={yAxisDomain}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" className="min-w-[200px] px-4 py-3" />}
            />
            <Area
              dataKey="value"
              type="linear"
              fill={`url(#${fillId})`}
              fillOpacity={0.4}
              stroke={colorVar}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="max-md:gap-4">
      <div className="flex items-center justify-between mb-4 max-md:contents">
        <TabsList className="max-md:w-full">
          <TabsTrigger value="accuracy">ACCURACY</TabsTrigger>
          <TabsTrigger value="loss">LOSS</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-6 max-md:order-1">
          {activeTab === "accuracy" && <ChartLegend label="Accuracy" color="var(--chart-1)" />}
          {activeTab === "loss" && <ChartLegend label="Loss" color="var(--chart-2)" />}
        </div>
      </div>
      <TabsContent value="accuracy" className="space-y-4">
        {renderChart(mockData.chartData.accuracy, accuracyConfig, "fillAccuracy", "var(--chart-1)", [0.37, 0.47])}
      </TabsContent>
      <TabsContent value="loss" className="space-y-4">
        {renderChart(mockData.chartData.loss, lossConfig, "fillLoss", "var(--chart-2)", [1.5, 1.7])}
      </TabsContent>
    </Tabs>
  )
}

export const ChartLegend = ({
  label,
  color,
}: {
  label: string
  color: string
}) => {
  return (
    <div className="flex items-center gap-2 uppercase">
      <div style={{ backgroundColor: color }} className="w-3 h-3 rounded-full" />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  )
}
