import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { RedirectToSignIn } from "@clerk/nextjs";
import TestSelector from "@/components/TestSelector";
import FeatureDescription from "@/components/FeatureDescription";
import ProgressBadge from "@/components/ProgressBadge";
import { auth } from "@clerk/nextjs/server";
import { getTopicAndId } from "@/lib/actions/test.action";

const testModes = [
	{ label: "Full Test", value: "full" },
	{ label: "Task 1 Only", value: "task1" },
	{ label: "Task 2 Only", value: "task2" },
];

const SpeakingTestSession = async () => {
	const { userId } = await auth();
	const { uniqueTopics } = await getTopicAndId("speaking");

	if (!userId) return <RedirectToSignIn />;

	return (
		<div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
			<h1 className="text-3xl font-bold text-center">
				Prepare for the IELTS Writing Test
			</h1>
			<p className="text-center text-gray-600">
				Choose a test set and review the format before beginning.
			</p>

			<ProgressBadge test="writing" />

			{/* Format Card */}
			<Card>
				<CardContent className="space-y-3 px-5">
					<h2 className="text-xl font-semibold">
						Writing Test Format
					</h2>
					<ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
						<li>
							<strong>Task 1:</strong> Describe visual information
							(e.g., charts, graphs, maps). (150 words - 20 mins)
						</li>
						<li>
							<strong>Task 2:</strong> Write an essay in response
							to a problem or argument. (250 words - 40 mins)
						</li>
					</ul>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Timer className="w-4 h-4" />
						Estimated Total Time: 60 minutes
					</div>

					<FeatureDescription
						content={
							<div>
								<p className="mb-2">
									Take the writing test using our AI-enhanced
									platform. You&apos;ll complete two writing
									tasks in a timed environment, and receive
									instant feedback on coherence, grammar,
									vocabulary, and structure.
								</p>
								<p>
									AI feedback helps you track improvement and
									understand where to focus for your next
									attempt.
								</p>
							</div>
						}
					/>
				</CardContent>
			</Card>

			<TestSelector
				test="writing"
				sets={uniqueTopics}
				testModes={testModes}
			/>
		</div>
	);
};

export default SpeakingTestSession;
