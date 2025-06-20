import { RedirectToSignIn } from "@clerk/nextjs";
import { getUserComponentResults } from "@/lib/actions/dashboard.action";
import { MessageSquare, PenLine } from "lucide-react";
import ResultAccordion from "@/components/ResultAccordion";
import { auth } from "@clerk/nextjs/server";
import FeedbackAccessModal from "@/components/FeedbackAccessModal";

const components = [
	// { key: "Listening", icon: <Headphones className="text-blue-600" /> },
	// { key: "Reading", icon: <BookText className="text-green-600" /> },
	{ key: "Writing", icon: <PenLine className="text-orange-600" /> },
	{ key: "Speaking", icon: <MessageSquare className="text-purple-600" /> },
];

const ResultsPage = async () => {
	const { userId, has } = await auth();
	if (!userId) return <RedirectToSignIn />;

	const hasAccess = has({ plan: "premium_plan" });

	const results: Record<string, TestResult[]> = {};
	await Promise.all(
		components.map(async (comp) => {
			const res = await getUserComponentResults(
				userId,
				comp.key as TestComponentType
			);
			results[comp.key] = res;
		})
	);

	return (
		<div
			className={`relative max-w-6xl mx-auto px-4 py-10 space-y-10 transition duration-500 ${
				hasAccess ? "" : "blur-sm pointer-events-none select-none"
			}`}
		>
			<h1 className="text-3xl font-bold text-center">Previous Results</h1>
			<ResultAccordion results={results} />

			{!hasAccess && (
				<div className="absolute inset-0 flex items-center justify-center z-50">
					<FeedbackAccessModal />
				</div>
			)}
		</div>
	);
};

export default ResultsPage;
