import { Star, Calendar, Award, CheckCircle, XCircle } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import {
	getFeedbackById,
	getViewWritingFeedbackPermission,
	getWritingSetForUser,
} from "@/lib/actions/test.action";
import FeedbackAccessModal from "@/components/FeedbackAccessModal";

const Page = async ({ params }: RouteParams) => {
	const { id } = await params;
	const { userId } = await auth();

	if (!userId) redirect("/sign-in");

	const writingSet = await getWritingSetForUser(id);
	if (!writingSet) redirect("/dashboard");

	const feedback = await getFeedbackById({
		id,
		userId: userId,
		test: "writing",
	});

	if (!feedback) {
		return (
			<section className="max-w-3xl mx-auto p-6 text-center">
				<h2 className="text-xl font-semibold mb-4">
					No feedback available
				</h2>
				<p className="text-muted-foreground">
					We couldn’t find your feedback for this test.
				</p>
			</section>
		);
	}

	const hasAccess = await getViewWritingFeedbackPermission();

	return (
		<section
			className={`relative max-w-3xl mx-auto p-6 space-y-8 transition duration-500 ${
				hasAccess ? "" : "blur-sm pointer-events-none select-none"
			}`}
		>
			{/* Header */}
			<div className="text-center">
				<h1 className="text-3xl font-bold text-primary">
					Writing Test Feedback
				</h1>
				<p className="text-sm text-muted-foreground mt-1">
					Your performance summary and tips for improvement.
				</p>
			</div>

			{/* Overall Band Score */}
			<div className="flex flex-wrap items-center justify-center gap-6 border p-4 rounded-xl shadow-sm bg-background">
				<div className="flex items-center gap-2">
					<Star className="w-5 h-5 text-green-500" />
					<span className="text-xl font-bold text-green-600">
						Band Score: {feedback.total_score?.toFixed(1) ?? "N/A"}
					</span>
				</div>
				<div className="flex items-center gap-2">
					<Calendar className="w-5 h-5 text-muted-foreground" />
					<span className="text-sm text-muted-foreground">
						{dayjs(feedback.created_at).format(
							"MMM D, YYYY h:mm A"
						)}
					</span>
				</div>
			</div>

			{/* Final Assessment */}
			<div className="bg-muted/40 p-5 rounded-xl shadow-sm">
				<h2 className="font-semibold text-lg mb-1">Final Assessment</h2>
				<p className="text-sm leading-relaxed text-muted-foreground">
					{feedback.final_assessment}
				</p>
			</div>

			{/* Interview Breakdown */}
			<div className="space-y-3">
				<h2 className="font-semibold text-lg flex items-center gap-2">
					<Award className="w-5 h-5 text-primary" />
					Breakdown by Criterion
				</h2>
				{feedback.category_scores?.map((category, index) => (
					<div
						key={index}
						className="p-4 border rounded-lg bg-muted/30 shadow-sm"
					>
						<p className="font-medium text-primary">
							{category.name}
							<span className="text-green-700 font-bold ml-2">
								{category.score}/9.0
							</span>
						</p>
						<p className="text-sm text-muted-foreground">
							{category.comment}
						</p>
					</div>
				))}
			</div>

			{/* Strengths */}
			{feedback.strengths?.length > 0 && (
				<div className="space-y-2">
					<h3 className="font-semibold text-md flex items-center gap-2">
						<CheckCircle className="w-5 h-5 text-green-600" />
						Strengths
					</h3>
					<ul className="list-disc pl-6 space-y-1 text-sm text-green-800">
						{feedback.strengths.map((s, i) => (
							<li key={i}>{s}</li>
						))}
					</ul>
				</div>
			)}

			{/* Areas for Improvement */}
			{feedback.areas_for_improvement?.length > 0 && (
				<div className="space-y-2">
					<h3 className="font-semibold text-md flex items-center gap-2">
						<XCircle className="w-5 h-5 text-red-500" />
						Areas for Improvement
					</h3>
					<ul className="list-disc pl-6 space-y-1 text-sm text-red-700">
						{feedback.areas_for_improvement.map((area, i) => (
							<li key={i}>{area}</li>
						))}
					</ul>
				</div>
			)}

			{/* Actions */}
			<div className="flex flex-col sm:flex-row gap-3 pt-4">
				<Button variant="secondary" className="w-full sm:w-1/2">
					<Link href="/dashboard" className="w-full text-center">
						Back to Dashboard
					</Link>
				</Button>
				<Button variant="default" className="w-full sm:w-1/2">
					<Link
						href={`/take-tests/speaking`}
						className="w-full text-center"
					>
						Retake Test
					</Link>
				</Button>
			</div>

			{!hasAccess && (
				<div className="absolute inset-0 flex items-center justify-center z-50">
					<FeedbackAccessModal />
				</div>
			)}
		</section>
	);
};

export default Page;
