import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "lucide-react";
import { RedirectToSignIn } from "@clerk/nextjs";
import {
	getSpeakingPermission,
	getTopicAndId,
} from "@/lib/actions/test.action";
import MicTest from "@/components/MicTest";
import ProgressBadge from "@/components/ProgressBadge";
import TestSelector from "@/components/TestSelector";
import FeatureDescription from "@/components/FeatureDescription";
import { auth } from "@clerk/nextjs/server";
import SpeakingLimitModal from "@/components/SpeakingLimitModal";

const testModes = [
	{ label: "Full Test", value: "full" },
	{ label: "Part 1 Only", value: "part1" },
	{ label: "Part 2 & 3", value: "part2and3" },
];

const SpeakingTestSession = async () => {
	const { userId } = await auth();
	const { uniqueTopics } = await getTopicAndId("speaking");

	if (!userId) return <RedirectToSignIn />;

	const hasSpeakingPermission = await getSpeakingPermission();
	console.log("Has speaking permission:", hasSpeakingPermission);

	return (
		<div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
			{!hasSpeakingPermission && <SpeakingLimitModal />}
			<h1 className="text-3xl font-bold text-center">
				Prepare for the IELTS Speaking Test
			</h1>
			<p className="text-center text-gray-600">
				Choose a test set and review the format before beginning.
			</p>

			<div className="flex justify-between items-center">
				<MicTest />

				<ProgressBadge test="speaking" />
			</div>

			{/* Format Card */}
			<Card>
				<CardContent className="space-y-3 px-5">
					<h2 className="text-xl font-semibold">
						Speaking Test Format
					</h2>
					<ul className="list-disc pl-5 text-gray-700 text-sm space-y-1">
						<li>
							<strong>Part 1:</strong> Introduction & Interview
							(4–5 mins)
						</li>
						<li>
							<strong>Part 2:</strong> Long Turn — 1-minute prep,
							1–2 mins speaking
						</li>
						<li>
							<strong>Part 3:</strong> Discussion on abstract
							ideas (4–5 mins)
						</li>
					</ul>
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Timer className="w-4 h-4" />
						Estimated Total Time: 11–14 minutes
					</div>

					<FeatureDescription
						content={
							<div>
								<p className="mb-2">
									Take the speaking test in real-time powered
									by AI. Our platform uses advanced voice
									recognition and AI-driven analysis to
									simulate an IELTS examiner.
								</p>
								<p>
									You&apos;ll answer questions live, and
									receive instant, personalized feedback on
									your fluency, pronunciation, and coherence —
									helping you improve faster with each
									attempt.
								</p>
							</div>
						}
					/>
				</CardContent>
			</Card>

			<TestSelector
				test="speaking"
				sets={uniqueTopics}
				testModes={testModes}
			/>
		</div>
	);
};

export default SpeakingTestSession;
