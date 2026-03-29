"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"


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

const generateData = (days: number) => {
    const data = []

    for (let i = 1; i <= days; i++) {
        const base = 40 + Math.random() * 30
        const isWeekend = i % 7 === 6 || i % 7 === 0

        const sessions = Math.round(
            isWeekend ? base - 10 : base + Math.random() * 10
        )

        data.push({
            day: `D${i}`, // ✅ shorter label (IMPORTANT)
            sessions: Math.max(20, sessions),
        })
    }

    return data
}

const chartConfig = {
    sessions: {
        label: "Doctor Sessions",
        color: "#14b8a6",
    },
} satisfies ChartConfig

export function ChartBarInteractive() {
    const [chartData, setChartData] = React.useState<any[]>([])

    React.useEffect(() => {
        setChartData(generateData(30))
    }, [])

    const totalSessions = React.useMemo(
        () => chartData.reduce((acc, curr) => acc + curr.sessions, 0),
        [chartData]
    )

    if (!chartData.length) return null

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col gap-2 px-6 pt-4 pb-3">
                <CardTitle>Doctor Sessions (Weekly)</CardTitle>
                <CardDescription>
                    Total sessions handled from Monday to Saturday
                </CardDescription>

                <div className="text-2xl font-bold">
                    {totalSessions} sessions
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="h-62.5 w-full"
                >
                    <LineChart
                        data={chartData}
                        margin={{ left: 0, right: 10, top: 10, bottom: 0 }}
                    >
                        <CartesianGrid stroke="hsl(var(--border))" vertical={false} />

                        <XAxis
                            dataKey="day"
                            tickLine={true}
                            axisLine={true}
                            interval="preserveStartEnd"
                            tickFormatter={(value, index) =>
                                index % Math.ceil(chartData.length / 6) === 0 ? value : ""
                            }
                        />

                        <ChartTooltip content={<ChartTooltipContent nameKey="sessions" />} />

                        <Line
                            type='monotoneX'
                            dataKey="sessions"
                            stroke={chartConfig.sessions.color}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 5 }}
                            style={{
                                filter: `drop-shadow(0 0 6px ${chartConfig.sessions.color})`,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
