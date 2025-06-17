"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import WordCount from "@/components/WordCount";

export default function WritingTestSession() {
	const [task1, setTask1] = useState("");
	const [task2, setTask2] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async () => {
		setIsSubmitting(true);
		await new Promise((r) => setTimeout(r, 1000));
		setIsSubmitting(false);
		setSubmitted(true);
	};

	return (
		<div className="w-full h-[90vh]">
			<Tabs defaultValue="task1" className="w-full h-full">
				<div className="flex justify-end px-10 pt-3">
					{/* Tab Buttons */}
					<TabsList className="w-1/4 flex justify-center mx-auto">
						<TabsTrigger value="task1">Task 1</TabsTrigger>
						<TabsTrigger value="task2">Task 2</TabsTrigger>
					</TabsList>
				</div>

				{/* Task 1 Content */}
				<TabsContent
					value="task1"
					className="flex flex-col md:flex-row h-full"
				>
					{/* Left Panel */}
					<div className="md:w-1/2 p-4 overflow-auto border-r border-muted">
						<h2 className="font-semibold mb-2">Task 1 Prompt</h2>
						<p className="text-sm text-muted-foreground mb-3">
							The chart below shows the percentage of households
							with internet access from 2000 to 2020.
						</p>
						{/* <img
                            src="/sample-task1-chart.png"
                            alt="Task 1 Chart"
                            className="w-full max-h-64 object-contain border rounded"
                        /> */}
					</div>

					{/* Right Panel */}
					<div className="md:w-1/2 p-4 flex flex-col h-full">
						<div className="flex justify-between items-center">
							<h2 className="font-semibold mb-2">Your Answer</h2>
							<CountdownTimer minutes={60} />
						</div>
						<Textarea
							value={task1}
							onChange={(e) => setTask1(e.target.value)}
							className="flex-1 resize-none h-full"
							placeholder="Write your Task 1 response here..."
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
						<p className="text-sm text-muted-foreground">
							Some people believe students should learn money
							management in school. Do you agree or disagree?
						</p>
					</div>

					{/* Right Panel */}
					<div className="md:w-1/2 p-4 flex flex-col h-full">
						<h2 className="font-semibold mb-2">Your Answer</h2>
						<Textarea
							value={task2}
							onChange={(e) => setTask2(e.target.value)}
							className="flex-1 resize-none h-full"
							placeholder="Write your Task 2 essay here..."
						/>
						<WordCount text={task2} />
					</div>
				</TabsContent>

				{/* Submit */}
				<div className="flex justify-end px-4 pt-3">
					<Button
						disabled={isSubmitting}
						onClick={handleSubmit}
						className="w-full md:w-auto"
					>
						{isSubmitting ? (
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
			</Tabs>
		</div>
	);
}
