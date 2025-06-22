"use client";

import {
	cn,
	configureAssistantFull,
	configureAssistantPart1,
	configureAssistantPart2and3,
} from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import soundwaves from "@/constants/soundwaves.json";
import loadingSpinner from "@/constants/loading.json";
import { useRouter } from "next/navigation";
import DropDownMenu from "./DropDownMenu";
import { createSpeakingFeedback } from "@/lib/actions/test.action";
import { toast } from "sonner";
import { TestPart } from "@/constants";

enum CallStatus {
	INACTIVE = "INACTIVE",
	CONNECTING = "CONNECTING",
	ACTIVE = "ACTIVE",
	FINISHED = "FINISHED",
}

const SpeakingComponent = ({
	userId,
	userName,
	userImage,
	setId,
	firstPartId,
	questions,
	topics,
	mode,
	setTestPart, // FIX ERROR TOO MANY ENUM
}: SpeakingComponentProps) => {
	const [callStatus, setCallStatus] = useState<CallStatus>(
		CallStatus.INACTIVE
	);
	const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const [readyState, setReadyState] = useState<boolean>(false); // Waiting for questions to be loaded
	const [isPartTwo, setIsPartTwo] = useState<boolean>(false);
	const [isPartThree, setIsPartThree] = useState<boolean>(false);
	const [isGeneratingFeedback, setIsGeneratingFeedback] =
		useState<boolean>(false);

	const [messages, setMessages] = useState<SavedMessage[]>([]);
	const [cueCard, setCueCard] = useState<CueCard>();

	const [showEndPrompt, setShowEndPrompt] = useState(false);

	const lottieRef = useRef<LottieRefCurrentProps>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const router = useRouter();

	useEffect(() => {
		if (questions) {
			setCueCard({
				main: questions.part2.main,
				bullet_points: questions.part2.bullet_points,
				final_line: questions.part2.final_line,
			});
			setReadyState(true);
		}
	}, [questions]);

	useEffect(() => {
		if (lottieRef) {
			if (isSpeaking) {
				lottieRef.current?.play();
			} else {
				lottieRef.current?.stop();
			}
		}
	}, [isSpeaking, lottieRef]);

	useEffect(() => {
		const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

		const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

		const onMessage = (message: Message) => {
			if (
				message.type === "transcript" &&
				message.transcriptType === "final"
			) {
				const newMessage = {
					role: message.role,
					content: message.transcript,
				};
				setMessages((prev) => [newMessage, ...prev]);
			}
		};

		const onSpeechStart = () => setIsSpeaking(true);
		const onSpeechEnd = () => setIsSpeaking(false);

		const onError = (error: Error) => console.log("Error:", error);

		vapi.on("call-start", onCallStart);
		vapi.on("call-end", onCallEnd);
		vapi.on("message", onMessage);
		vapi.on("error", onError);
		vapi.on("speech-start", onSpeechStart);
		vapi.on("speech-end", onSpeechEnd);

		return () => {
			vapi.off("call-start", onCallStart);
			vapi.off("call-end", onCallEnd);
			vapi.off("message", onMessage);
			vapi.off("error", onError);
			vapi.off("speech-start", onSpeechStart);
			vapi.off("speech-end", onSpeechEnd);
		};
	}, []);

	useEffect(() => {
		const role = messages[0]?.role;
		const content = messages[0]?.content.toLowerCase();
		console.log("Latest message:", messages[0]);
		if (role === "assistant") {
			if (content.includes("part 2")) {
				setTestPart(TestPart.part2);
				setIsPartTwo(true);
			} else if (content.includes("part 3")) {
				setTestPart(TestPart.part3);
				setIsPartTwo(false);
				setIsPartThree(true);
			}
		}

		if (isPartTwo) {
			if (role === "assistant" && content.includes("when you're ready")) {
				startPlanningPhase();
			}
			if (
				role === "user" &&
				(content.includes("i'm ready") ||
					content.includes("im ready") ||
					content.includes("ready"))
			) {
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				vapi.say("Please start speaking now.");
			}
		}

		// if (
		// 	role === "assistant" &&
		// 	content.includes("thank you") &&
		// 	content.includes("your feedback")
		// ) {
		// 	setTimeout(() => {
		// 		handleDisconnect();
		// 	}, 2000);
		// }

		if (
			role === "assistant" &&
			(content.includes("concludes the ielts") ||
				content.includes("feedback"))
		) {
			setShowEndPrompt(true);
		}
	}, [messages, setTestPart, isPartTwo]);

	const handleGenerateFeedback = async (messsages: SavedMessage[]) => {
		console.log("Generate feedback with messages:", messsages);

		const { success, feedbackId: id } = await createSpeakingFeedback({
			userId: userId,
			testId: setId,
			firstPartId: firstPartId,
			transcript: messsages,
		});

		if (success && id) {
			router.push(`/take-tests/speaking/${setId}/feedback`);
		} else {
			console.log("Failed to generate feedback");
			router.push("/take-tests/speaking");
			toast("Failed to generate feedback");
		}
	};

	useEffect(() => {
		if (callStatus === CallStatus.FINISHED) {
			setIsGeneratingFeedback(true);
			handleGenerateFeedback(messages).finally(() => {
				setIsGeneratingFeedback(false);
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages, callStatus]);

	const startPlanningPhase = async () => {
		if (!vapi) return;

		// start 1-minute timer
		timeoutRef.current = setTimeout(() => {
			vapi.say("Please start speaking now.");
		}, 60000);
	};

	const toggleMicrophone = () => {
		const isMuted = vapi.isMuted();
		vapi.setMuted(!isMuted);
		setIsMuted(!isMuted);
	};

	const handleCall = async () => {
		setCallStatus(CallStatus.CONNECTING);

		let formattedPart1 = "";
		let formattedPart2 = "";
		let formattedPart3 = "";

		if (questions) {
			formattedPart1 = questions.part1
				.map((question) => `- ${question.question_text}`)
				.join("\n");
			formattedPart2 = `${cueCard?.main}\n${cueCard?.bullet_points
				.map((point) => `- ${point}`)
				.join("\n")}\n${cueCard?.final_line}`;
			formattedPart3 = questions.part3
				.map((question) => `- ${question.question_text}`)
				.join("\n");
		}

		const assistantOverrides = {
			variableValues: {
				questions_part1: formattedPart1,
				questions_part2: formattedPart2,
				questions_part3: formattedPart3,
				firstTopic: topics[0],
				secondTopic: topics[1],
			},
			clientMessages: ["transcript"],
			serverMessages: [],
		};

		if (mode === "full") {
			vapi.start(
				configureAssistantFull("male", "formal"),
				// @ts-expect-error typecript error
				assistantOverrides
			);
		} else if (mode === "part1") {
			vapi.start(
				configureAssistantPart1("male", "formal"),
				// @ts-expect-error typecript error
				assistantOverrides
			);
		} else {
			vapi.start(
				configureAssistantPart2and3("male", "formal"),
				// @ts-expect-error typecript error
				assistantOverrides
			);
		}
	};

	const handleDisconnect = () => {
		setCallStatus(CallStatus.FINISHED);
		vapi.stop();
	};

	return (
		<section className="flex flex-col h-[70vh] mb-20">
			<section className="flex gap-8 max-sm:flex-col">
				<div className="speaking-section max-sm:py-5">
					<div
						className="speaking-avatar"
						style={{ backgroundColor: "pink" }}
					>
						<div
							className={cn(
								"absolute transition-opacity, duration-1000",
								callStatus === CallStatus.FINISHED ||
									callStatus === CallStatus.INACTIVE
									? "opacity-100"
									: "opacity-0",
								callStatus === CallStatus.CONNECTING &&
									"opacity-100 animate-pulse"
							)}
						>
							<Image
								src="/logo.svg"
								alt="logo"
								width={150}
								height={150}
								className="object-contain p-4 max-sm:p-1"
							/>
						</div>
						<div
							className={cn(
								"absolute transition-opacity duration-1000",
								callStatus === CallStatus.ACTIVE
									? "opacity-100"
									: "opacity-0"
							)}
						>
							<Lottie
								lottieRef={lottieRef}
								animationData={soundwaves}
								autoPlay={false}
								className="speaking-lottie"
							/>
						</div>
					</div>
					<p className="font-bold text-2xl">Speaking AI Examiner</p>
					{showEndPrompt && (
						<p className="mt-2 text-sm text-yellow-600 animate-pulse font-medium">
							The test is finished. Please click &quot;End
							Session&quot; to complete.
						</p>
					)}
				</div>

				<div className="user-section">
					<div className="user-avatar">
						<Image
							src={userImage}
							alt={userName}
							width={130}
							height={130}
							className="rounded-lg"
						/>
						<p className="font-bold text-2xl">{userName}</p>
					</div>
					<button className="btn-mic" onClick={toggleMicrophone}>
						<Image
							src={
								isMuted
									? "/icons/mic-off.svg"
									: "/icons/mic-on.svg"
							}
							alt="mic"
							width={36}
							height={36}
						/>
						<p className="max-sm:hidden">
							{isMuted
								? "Turn on microphone"
								: "Turn off microphone"}
						</p>
					</button>
					<button
						disabled={!readyState}
						className={cn(
							"rounded-lg py-2 cursor-pointer transition-colors w-full text-white",
							callStatus === CallStatus.ACTIVE
								? "bg-red-700"
								: "bg-primary",
							callStatus === CallStatus.CONNECTING &&
								"animate-pulse",
							callStatus === CallStatus.INACTIVE &&
								readyState &&
								"glow-pulse",
							!readyState &&
								"bg-gray-400 cursor-not-allowed opacity-70",
							showEndPrompt && "glow-pulse"
						)}
						onClick={
							callStatus === CallStatus.ACTIVE
								? handleDisconnect
								: handleCall
						}
					>
						{callStatus === CallStatus.ACTIVE
							? "End Session"
							: callStatus === CallStatus.CONNECTING
							? "Connecting"
							: "Start Session"}
					</button>
				</div>
			</section>

			<div className="mt-6 px-4 bg-blue-50 rounded-md text-sm text-blue-900">
				<DropDownMenu
					value={isPartTwo || isPartThree ? "item-1" : ""}
					trigger={
						<div className="flex items-center gap-2 mb-2">
							<h3 className="font-semibold">Part 2 Cue Card</h3>
							{!(isPartTwo && isPartThree) && (
								<span className="text-xs px-2 py-1 bg-red-300 text-yellow-900 rounded-full font-semibold uppercase">
									Only Available in Part 2
								</span>
							)}
						</div>
					}
					content={
						<div>
							<p className="text-sm font-semibold mb-2">
								{cueCard?.main}
							</p>
							<ul className="list-disc pl-6 text-sm space-y-1">
								{cueCard?.bullet_points.map((point, index) => (
									<li key={index}>{point}</li>
								))}
							</ul>
							<p className="mt-2 text-sm">
								{cueCard?.final_line}
							</p>
						</div>
					}
				/>
			</div>
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
		</section>
	);
};

export default SpeakingComponent;
