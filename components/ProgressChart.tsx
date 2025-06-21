"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserScoresWithTarget } from "@/lib/actions/dashboard.action";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Button } from "./ui/button";

const chartConfig = {
	band: {
		label: "Actual Band",
		color: "#ef4444",
	},
	target: {
		label: "Target Band",
		color: "#9ca3af",
	},
} satisfies ChartConfig;

const ProgressChart = () => {
	const { user } = useUser();
	const [chartData, setChartData] = useState<
		{ day: string; band: number; target: number }[] | null
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) return;

			setLoading(true);

			const data = await getUserScoresWithTarget(user.id);
			setChartData(data);

			setLoading(false);
		};

		fetchData();
	}, [user]);

	if (loading) {
		return (
			<div className="w-full lg:h-64 md:h-64">
				<Skeleton className="w-full h-full rounded-md" />
			</div>
		);
	}

	if (!chartData) {
		return (
			<div className="flex flex-col items-center justify-center py-10 gap-4 text-center text-light-100">
				<span className="flex items-center gap-2 text-2xl px-5 py-1 bg-yellow-300 text-yellow-900 rounded-full font-semibold uppercase">
					No Progress Yet
					<BarChart3 className="w-8 h-8 text-primary-300" />
				</span>

				<p className="text-sm text-gray-300 max-w-xs">
					Take a few practice tests to start tracking your band score
					progress here.
				</p>

				<Link href="/take-tests">
					<Button className="bg-primary-500 text-white hover:bg-primary-400 transition-colors hover:cursor-pointer mt-2">
						Start Your First Test
					</Button>
				</Link>
			</div>
		);
	}

	return (
		<div className="w-full lg:h-64 md:h-64 text-sm">
			<ChartContainer config={chartConfig} className="h-full w-full">
				<LineChart
					data={chartData}
					margin={{ top: 20, right: 40, left: 0, bottom: 5 }}
				>
					<CartesianGrid
						vertical={false}
						strokeDasharray="3 3"
						stroke="#374151"
					/>
					<XAxis
						dataKey="day"
						tickLine={false}
						axisLine={false}
						tick={{ fill: "#9ca3af" }}
						tickMargin={8}
					/>
					<YAxis
						domain={[4, 9]}
						tickCount={6}
						tickLine={false}
						axisLine={false}
						tick={{ fill: "#9ca3af" }}
						tickMargin={8}
					/>
					<Legend verticalAlign="top" height={36} />
					<ChartTooltip content={<ChartTooltipContent />} />
					<Line
						type="linear"
						dataKey="band"
						stroke="#ef4444"
						strokeWidth={2}
						dot
						connectNulls={false}
						isAnimationActive={false}
					/>
					<Line
						type="monotone"
						dataKey="target"
						stroke="#9ca3af"
						strokeWidth={2}
						strokeDasharray="5 5"
						dot={false}
					/>
				</LineChart>
			</ChartContainer>
		</div>
	);
};

export default ProgressChart;
