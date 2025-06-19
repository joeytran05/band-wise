import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Timer } from "lucide-react";

const Loading = () => {
	return (
		<div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
			<h1 className="text-3xl font-bold text-center animate-pulse">
				Prepare for the IELTS Test
			</h1>
			<p className="text-center text-gray-500 animate-pulse">
				Choose a test set and review the format before beginning.
			</p>

			<div className="flex justify-between items-center">
				<Skeleton className="h-10 w-32" />
				<Skeleton className="h-6 w-40" />
			</div>

			<Card>
				<CardContent className="space-y-3 px-5 py-6">
					<Skeleton className="h-6 w-2/3" />
					<div className="space-y-2 pl-5">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/5" />
					</div>

					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Timer className="w-4 h-4 animate-pulse" />
						<Skeleton className="h-4 w-32" />
					</div>

					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-11/12" />
					</div>
				</CardContent>
			</Card>

			{/* TestSelector Placeholder */}
			<div className="space-y-3">
				<Skeleton className="h-6 w-1/3" />
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
					<Skeleton className="h-16 w-full" />
				</div>
			</div>
		</div>
	);
};

export default Loading;
