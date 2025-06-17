import {
	getTopicAndId,
	getUniqueCompletedCount,
} from "@/lib/actions/test.action";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const ProgressBadge = async ({ test }: { test: string }) => {
	const user = await currentUser();
	if (!user) {
		return (
			<div className="flex justify-end">
				<span className="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground">
					Please sign in to view progress
				</span>
			</div>
		);
	}
	const { topics } = await getTopicAndId(test);
	const completedCount = await getUniqueCompletedCount(user!.id, test);
	const numberOfSets = topics?.length;
	return (
		<div className="flex justify-end">
			<span className="text-sm px-3 py-1 rounded-full inline-flex items-center gap-2 bg-green-100 text-green-800">
				{completedCount} of {numberOfSets} completed
			</span>

			{/* <span
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
					`${completedCount} of ${numberOfSets ?? "?"} completed`
				)}
			</span> */}
		</div>
	);
};

export default ProgressBadge;
