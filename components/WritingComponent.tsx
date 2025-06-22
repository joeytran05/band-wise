"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import WordCount from "@/components/WordCount";
import { useState } from "react";
import Image from "next/image";
import useCountdown from "@/hooks/useCountdown";
import { createWritingFeedback } from "@/lib/actions/test.action";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Lottie from "lottie-react";
import loadingSpinner from "@/constants/loading.json";

const WritingComponent = ({
	// topic,
	firstPart,
	firstPartImgUrl,
	secondPart,
	setId,
	mode,
}: WritingComponentProps) => {
	const [task1, setTask1] = useState("");
	const [task2, setTask2] = useState("");
	const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const { user } = useUser();
	const router = useRouter();

	const { formatted, isTimeUp } = useCountdown(60);

	const handleSubmit = async () => {
		setIsGeneratingFeedback(true);
		setSubmitted(true);
		handleGenerateFeedback().finally(() => {
			setIsGeneratingFeedback(false);
		});
	};

	const handleGenerateFeedback = async () => {
		console.log("Generate feedback with answers:", [task1, task2]);

		const { success, feedbackId: id } = await createWritingFeedback({
			userId: user!.id,
			testId: setId,
			task1Question: firstPart,
			task1: task1,
			task2Question: secondPart,
			task2: task2,
		});

		if (success && id) {
			router.push(`/take-tests/writing/${setId}/feedback`);
		} else {
			console.log("Failed to generate feedback");
			router.push("/take-tests/writing");
			toast("Failed to generate feedback");
		}
	};

	return (
		<Tabs
			defaultValue={mode === "task2" ? "task2" : "task1"}
			className="w-full h-full"
		>
			<div className="flex justify-end px-10 pt-3">
				{/* Tab Buttons */}
				<TabsList className="w-1/4 flex justify-center mx-auto">
					<TabsTrigger value="task1" disabled={mode === "task2"}>
						Task 1
					</TabsTrigger>
					<TabsTrigger value="task2" disabled={mode === "task1"}>
						Task 2
					</TabsTrigger>
				</TabsList>
			</div>

			{/* Task 1 Content */}
			<TabsContent
				value="task1"
				className="flex flex-col md:flex-row h-full"
			>
				{/* Left Panel */}
				<div className="md:w-1/2 p-4 overflow-auto border-b md:border-b-0 md:border-r border-muted">
					<h2 className="font-semibold mb-2">Task 1 Prompt</h2>
					<p className="text-lg mb-3">{firstPart}</p>
					<div className="w-full max-w-full h-auto aspect-[4/3] relative mt-4">
						<Image
							src={firstPartImgUrl}
							alt="Task 1 Image"
							fill
							className="object-contain"
							sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
							priority
						/>
					</div>
				</div>

				{/* Right Panel */}
				<div className="md:w-1/2 p-4 flex flex-col h-full">
					<div className="flex justify-between items-center">
						<h2 className="font-semibold mb-2">Your Answer</h2>
						<CountdownTimer
							formatted={formatted}
							isTimeUp={isTimeUp}
						/>
					</div>
					<Textarea
						value={task1}
						onChange={(e) => setTask1(e.target.value)}
						className="flex-1 resize-none h-full"
						placeholder="Write your Task 1 response here..."
						disabled={isTimeUp}
					/>
					<WordCount text={task1} />
				</div>
			</TabsContent>

			{/* Task 2 Content */}
			<TabsContent
				value="task2"
				className="flex flex-col md:flex-row h-full"
			>
				{/* Left Panel */}
				<div className="md:w-1/2 p-4 overflow-auto border-r border-muted">
					<h2 className="font-semibold mb-2">Task 2 Prompt</h2>
					<p className="text-lg">{secondPart}</p>
				</div>

				{/* Right Panel */}
				<div className="md:w-1/2 p-4 flex flex-col h-full">
					<div className="flex justify-between items-center">
						<h2 className="font-semibold mb-2">Your Answer</h2>
						<CountdownTimer
							formatted={formatted}
							isTimeUp={isTimeUp}
						/>
					</div>
					<Textarea
						value={task2}
						onChange={(e) => setTask2(e.target.value)}
						className="flex-1 resize-none h-full"
						placeholder="Write your Task 2 essay here..."
						disabled={isTimeUp}
					/>
					<WordCount text={task2} />
				</div>
			</TabsContent>

			{/* Submit */}
			<div className="flex justify-end items-end px-4 pt-3">
				<Button
					disabled={isGeneratingFeedback}
					onClick={handleSubmit}
					className="w-full md:w-auto"
				>
					{isGeneratingFeedback ? (
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Submitting...</span>
						</div>
					) : (
						"Submit Writing Test"
					)}
				</Button>
			</div>

			{submitted && (
				<p className="text-center text-green-600 text-sm mt-2">
					✅ Your answers were submitted successfully.
				</p>
			)}

			{isGeneratingFeedback && (
				<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30">
					<div className="flex flex-col items-center">
						<Lottie
							animationData={loadingSpinner}
							loop
							className="w-32 h-32"
						/>
						<p className="mt-4 text-lg text-gray-800 font-semibold">
							Generating feedback...
						</p>
					</div>
				</div>
			)}
		</Tabs>
	);
};

export default WritingComponent;
