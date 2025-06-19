"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import {
	upsertUserTargetBand,
	getUserOnboardingStatus,
} from "@/lib/actions/dashboard.action";
import clsx from "clsx";

const TOTAL_STEPS = 3;

const OnboardingModal = () => {
	const { user } = useUser();
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState(1);
	const [targetBand, setTargetBand] = useState("");
	const [loading, setLoading] = useState(false);
	const [hasLoaded, setHasLoaded] = useState(false);
	const [glowNext, setGlowNext] = useState(false);

	const isValidBand = (val: string): boolean => {
		const num = parseFloat(val);
		const allowed = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];
		return allowed.includes(num);
	};

	useEffect(() => {
		const checkOnboarding = async () => {
			if (!user?.id) return;
			const onboarded = await getUserOnboardingStatus(user.id);
			if (!onboarded) {
				setOpen(true);
			}
			setHasLoaded(true);
		};
		checkOnboarding();
	}, [user]);

	const handleSave = async () => {
		if (!user?.id || !isValidBand(targetBand)) return;
		setLoading(true);
		await upsertUserTargetBand(user.id, parseFloat(targetBand));
		setLoading(false);
		setOpen(false);
	};

	const handleNext = () => {
		if (step === TOTAL_STEPS) {
			handleSave();
		} else {
			setStep((prev) => prev + 1);
		}
	};

	const handleBack = () => {
		if (step > 1) {
			setStep((prev) => prev - 1);
		}
	};

	const handleOpenChange = (val: boolean) => {
		if (!val && (step < TOTAL_STEPS || !isValidBand(targetBand))) {
			setGlowNext(true);
			setTimeout(() => setGlowNext(false), 1000);
			return;
		}
		setOpen(val);
	};

	if (!hasLoaded) return null;

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-md pt-7 pb-0 rounded-lg space-y-6 transition-all duration-300">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-red-600 text-center">
						{step === 1 && "🎉 Welcome to BandWise!"}
						{step === 2 && "✨ What can you do here?"}
						{step === 3 && "🎯 Set Your Target Band"}
					</DialogTitle>
				</DialogHeader>

				<div
					key={step}
					className="text-base text-muted-foreground animate-fade-in transition-all"
				>
					{step === 1 && (
						<p className="text-lg text-center">
							We’re excited to help you improve your IELTS score
							using real-time AI. Let’s get started!
						</p>
					)}

					{step === 2 && (
						<ul className="list-disc list-inside space-y-2 text-md">
							<li>
								💬 Real-time Speaking tests with AI examiners
							</li>
							<li>📈 Band progress tracking over time</li>
							<li>
								🎓 Personalized feedback based on your goals
							</li>
						</ul>
					)}

					{step === 3 && (
						<div>
							<p className="mb-2 text-md font-medium">
								What is your IELTS target band?
							</p>
							<Input
								type="number"
								min={4}
								max={9}
								step={0.5}
								value={targetBand}
								onChange={(e) => setTargetBand(e.target.value)}
								placeholder="e.g. 7.5"
								className="text-lg"
							/>
							{targetBand && !isValidBand(targetBand) && (
								<p className="text-red-500 text-sm mt-1">
									Must be between 4.0 and 9.0 in 0.5
									increments.
								</p>
							)}
						</div>
					)}
				</div>

				{/* Controls */}
				<div className="flex justify-between items-center mt-6">
					<Button
						variant="ghost"
						onClick={handleBack}
						disabled={step === 1}
						className="text-muted-foreground"
					>
						Back
					</Button>

					{/* Progress Indicator */}
					<div className="flex justify-center gap-2">
						{Array.from({ length: TOTAL_STEPS }, (_, i) => (
							<div
								key={i}
								className={`w-3 h-3 rounded-full transition-all ${
									step === i + 1
										? "bg-red-600 scale-110"
										: "bg-gray-300"
								}`}
							/>
						))}
					</div>

					<Button
						onClick={handleNext}
						disabled={
							loading || (step === 3 && !isValidBand(targetBand))
						}
						className={clsx(
							"transition-all duration-300",
							glowNext && "glow-pulse"
						)}
					>
						{loading
							? "Saving..."
							: step === TOTAL_STEPS
							? "Get Started"
							: "Next"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default OnboardingModal;
