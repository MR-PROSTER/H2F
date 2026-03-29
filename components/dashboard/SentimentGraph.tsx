"use client"

import * as React from "react"
import {
    Line,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    ResponsiveContainer,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"


// ✅ Sentiment Data Generator (REALISTIC)
const generateSentimentData = (days: number) => {
    const data = []
    let base = 0.6

    for (let i = 1; i <= days; i++) {
        const change = (Math.random() - 0.5) * 0.1
        base += change

        // clamp values
        base = Math.max(0.3, Math.min(0.9, base))

        data.push({
            day: `D${i}`,
            sentiment: Number(base.toFixed(2)),
        })
    }

    return data
}


// ✅ Chart Config
const chartConfig = {
    sentiment: {
        label: "Sentiment Score",
        color: "#14b8a6",
    },
} satisfies ChartConfig


export function SentimentTrendChart() {
    const [chartData, setChartData] = React.useState<any[]>([])

    // ✅ SSR-safe data generation
    React.useEffect(() => {
        setChartData(generateSentimentData(30)) // change to 7 / 90 easily
    }, [])

    const avgSentiment = React.useMemo(() => {
        if (!chartData.length) return 0
        return (
            chartData.reduce((acc, curr) => acc + curr.sentiment, 0) /
            chartData.length
        )
    }, [chartData])

    if (!chartData.length) return null

    // ✅ shared line style (CONSISTENCY)
    const lineProps = {
        type: "monotone" as const,
        strokeWidth: 2,
        dot: false,
        activeDot: { r: 5 },
        style: {
            filter: `drop-shadow(0 0 6px ${chartConfig.sentiment.color})`,
        },
    }

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col gap-2 px-6 pt-4 pb-3">
                <CardTitle>Sentiment Trend</CardTitle>
                <CardDescription>
                    Patient sentiment over time
                </CardDescription>

                <div className="text-2xl font-bold">
                    {(avgSentiment * 100).toFixed(0)}% positive
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="h-[250px] w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ left: 12, right: 12 }}
                        >
                            <CartesianGrid
                                stroke="hsl(var(--border))"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="day"
                                tickFormatter={(value, index) =>
                                    index % Math.ceil(chartData.length / 6) === 0
                                        ? value
                                        : ""
                                }
                            />

                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        nameKey="sentiment"
                                        formatter={(value) =>
                                            `${(Number(value) * 100).toFixed(0)}%`
                                        }
                                    />
                                }
                            />

                            <Line
                                dataKey="sentiment"
                                stroke={chartConfig.sentiment.color}
                                {...lineProps}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
