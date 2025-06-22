"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { getRandomSetId } from "@/lib/actions/test.action";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { capitalize } from "@/lib/utils";
import { useTestAccessStore } from "@/stores/useTestAccessStore";
import { FaLock } from "react-icons/fa";

interface TestSelectorProps {
	test: string;
	sets: Set[];
	testModes: { [key: string]: string }[];
	hasPartialAccess: boolean;
}

interface Set {
	id: string;
	topic: string;
}

const TestSelector = ({
	test,
	sets,
	testModes,
	hasPartialAccess,
}: TestSelectorProps) => {
	const [selectedSetId, setSelectedSetId] = useState<string>("random");
	const [testMode, setTestMode] = useState("full");

	const [isStarting, setIsStarting] = useState<boolean>(false);

	const { user, isLoaded } = useUser();
	const router = useRouter();

	const allowAccess = useTestAccessStore((state) => state.allowAccess);

	if (!user && isLoaded) throw new Error("User not authenticated");

	const handleSetChange = (value: string) => {
		setSelectedSetId(value);
	};

	const handleTestChange = (value: string) => {
		setTestMode(value);
	};

	const redirectToTest = (id: string) => {
		router.push(`/take-tests/${test}/${id}?mode=${testMode}`);
	};

	const startTest = async () => {
		setIsStarting(true);

		const idToUse =
			selectedSetId === "random"
				? `${await getRandomSetId(user!.id, test)}`
				: selectedSetId;

		allowAccess();
		redirectToTest(idToUse);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-around gap-10">
				{/* Test Set Selector */}
				<div className="space-y-2">
					<Label>Select a {capitalize(test)} Set</Label>
					<Select
						value={selectedSetId}
						onValueChange={handleSetChange}
					>
						<SelectTrigger>
							<SelectValue placeholder="Choose a topic or pick randomly" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="random">🎲 Random</SelectItem>
							{sets.map(({ id, topic }) => (
								<SelectItem key={id} value={id.toString()}>
									{topic}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Test Mode Selector */}
				<div className="space-y-2">
					<Label>Select a Test Mode</Label>
					<Select value={testMode} onValueChange={handleTestChange}>
						<SelectTrigger>
							<SelectValue placeholder="Choose test mode" />
						</SelectTrigger>
						<SelectContent>
							{testModes.map(({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			{/* Start Button */}
			<div className="text-center pt-4">
				{!hasPartialAccess && testMode != "full" ? (
					<div className="flex flex-col items-center gap-2">
						<span className="text-xs px-2 py-1 bg-red-400 text-yellow-900 rounded-full font-semibold uppercase">
							Upgrade to Access Partial Tests
						</span>
						<Button size="lg" className="w-full md:w-auto" disabled>
							Upgrade Now <FaLock />
						</Button>
					</div>
				) : (
					<Button
						size="lg"
						className="w-full md:w-auto"
						onClick={startTest}
						disabled={isStarting}
					>
						{isStarting ? (
							<div className="flex items-center gap-2">
								<Loader2 className="animate-spin w-4 h-4" />
								<span>Starting...</span>
							</div>
						) : (
							`Start ${capitalize(test)} Test`
						)}
					</Button>
				)}
			</div>
		</div>
	);
};

export default TestSelector;
