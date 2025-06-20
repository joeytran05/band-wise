"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import {
	getTopicAndId,
	getUniqueCompletedCount,
} from "@/lib/actions/test.action";
import { cn } from "@/lib/utils";

const ProgressBadge = ({ test }: { test: string }) => {
	const { user, isLoaded } = useUser();
	const [completedCount, setCompletedCount] = useState<number>(0);
	const [numberOfSets, setNumberOfSets] = useState<number>(0);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchProgress = async () => {
			if (!user?.id) return;
			if (test !== "speaking" && test !== "writing") return;
			setIsLoading(true);
			try {
				const { topics } = await getTopicAndId(test);
				const completed = await getUniqueCompletedCount(user.id, test);
				setCompletedCount(completed);
				setNumberOfSets(topics?.length ?? 0);
			} catch (error) {
				console.error("Failed to fetch progress:", error);
			}
			setIsLoading(false);
		};

		if (isLoaded) {
			fetchProgress();
		}
	}, [isLoaded, user, test]);

	if (!isLoaded) return null;

	return (
		<div className="flex justify-end">
			<span
				className={cn(
					"text-sm px-3 py-1 rounded-full inline-flex items-center gap-2",
					isLoading
						? "bg-muted text-muted-foreground animate-pulse"
						: "bg-green-100 text-green-800"
				)}
			>
				{isLoading ? (
					<>
						<Loader2 className="w-3 h-3 animate-spin" />
						<span>Loading...</span>
					</>
				) : (
					`${completedCount} of ${numberOfSets} completed`
				)}
			</span>
		</div>
	);
};

export default ProgressBadge;
