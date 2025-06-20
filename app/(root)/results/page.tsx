import { RedirectToSignIn } from "@clerk/nextjs";
import { getUserComponentResults } from "@/lib/actions/dashboard.action";
import { MessageSquare, PenLine } from "lucide-react";
import ResultAccordion from "@/components/ResultAccordion";
import { currentUser } from "@clerk/nextjs/server";

const components = [
	// { key: "Listening", icon: <Headphones className="text-blue-600" /> },
	// { key: "Reading", icon: <BookText className="text-green-600" /> },
	{ key: "Writing", icon: <PenLine className="text-orange-600" /> },
	{ key: "Speaking", icon: <MessageSquare className="text-purple-600" /> },
];

const ResultsPage = async () => {
	const user = await currentUser();

	if (!user?.id) return <RedirectToSignIn />;

	const results: Record<string, TestResult[]> = {};
	await Promise.all(
		components.map(async (comp) => {
			const res = await getUserComponentResults(
				user.id,
				comp.key as TestComponentType
			);
			results[comp.key] = res;
		})
	);

	return (
		<div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
			<h1 className="text-3xl font-bold text-center">Previous Results</h1>
			<ResultAccordion results={results} />
		</div>
	);
};

export default ResultsPage;
