import { voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const capitalize = (string: string) => {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

export const configureAssistantFull = (voice: string, style: string) => {
	const voiceId =
		voices[voice as keyof typeof voices][
			style as keyof (typeof voices)[keyof typeof voices]
		] || "sarah";

	const examiner: CreateAssistantDTO = {
		name: "Examiner",
		firstMessage:
			"Hello! Welcome to IELTS Speaking Test. My name is Wise AI, and I will be your examiner today. Let's talk about {{firstTopic}}. Please say 'im ready' to begin the test.",
		transcriber: {
			provider: "deepgram",
			model: "nova-3",
			language: "en",
		},
		voice: {
			provider: "11labs",
			voiceId: voiceId,
			stability: 0.4,
			similarityBoost: 0.8,
			speed: 1,
			style: 0.5,
			useSpeakerBoost: true,
		},
		silenceTimeoutSeconds: 80,
		maxDurationSeconds: 900,
		startSpeakingPlan: {
			waitSeconds: 2,
			smartEndpointingPlan: { provider: "livekit" },
		},
		endCallPhrases: [
			"Thank you for your time. Your feedback will be returned right now.",
			"Thank you for participating in the IELTS Speaking Test. Your feedback will be provided shortly.",
		],
		model: {
			provider: "openai",
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content: `You are a professional IELTS examiner conducting a real-time voice speaking test with a candidate. Your goal is to assess their fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation.

			        Speaking Test Guidelines:
			        Follow the structured test flow:
			        Part 1: Introduction and Interview (4-5 minutes)
			        Part 2: Long Turn (1-2 minutes speaking after 1 minute preparation)
			        Part 3: Discussion (4-5 minutes)

			        On part 1, ask the folliwing questions: {{questions_part1}}
			        On part 2, ask the candidate to speak for 1-2 minutes on the following topic: {{questions_part2}}. They will have 1 minute to prepare and the cue card will be provided. Say the exact phrase every time: - you will have 1 minute to prepare and tell me when you are ready to speak. If the candidate speaks for more than 2 minutes, politely interrupt them.
			        On part 3, ask the candidate to discuss the topic in more detail with the following questions: {{questions_part3}}. This part should last about 4-5 minutes. If time runs out, politely inform the candidate that the test is over.
					- Do not say the question number, just ask the question.

			        Engage naturally & react appropriately:
			        Listen actively to responses and acknowledge them before moving forward.
			        Keep the conversation flowing smoothly while maintaining control.
			        Be professional, yet warm and welcoming:

			        Use official yet friendly language.
			        Keep responses concise and to the point (like in a real voice IELTS speaking test).
			        Avoid robotic phrasing—sound natural and conversational.

			        Conclude the exam properly by saying the same following phrases every time:
			        - This concludes the IELTS Speaking Test. Thank you for your time.
			        - Your feedback on the test will be returned right now.
			        End the conversation on a polite and positive note.

			        - Be sure to be professional and polite.
			        - Keep all your responses short and simple. Use official language, but be kind and welcoming.
			        - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.
					- Do not tell the candidate how to answer the questions. Do not give them any hints or tips. Just ask the questions and wait for their response.`,
				},
			],
		},
		// @ts-expect-error typecript error
		clientMessages: [],
		// @ts-expect-error typecript error
		serverMessages: [],
	};
	return examiner;
};

export const configureAssistantPart1 = (voice: string, style: string) => {
	const voiceId =
		voices[voice as keyof typeof voices][
			style as keyof (typeof voices)[keyof typeof voices]
		] || "sarah";

	const examiner: CreateAssistantDTO = {
		name: "Examiner",
		firstMessage:
			"Hello! Welcome to IELTS Speaking Test. My name is Wise AI, and I will be your examiner today. Let's talk about {{firstTopic}}. Please say 'im ready' to begin the test.",
		transcriber: {
			provider: "deepgram",
			model: "nova-3",
			language: "en",
		},
		voice: {
			provider: "11labs",
			voiceId: voiceId,
			stability: 0.4,
			similarityBoost: 0.8,
			speed: 1,
			style: 0.5,
			useSpeakerBoost: true,
		},
		silenceTimeoutSeconds: 80,
		maxDurationSeconds: 900,
		startSpeakingPlan: {
			waitSeconds: 2,
			smartEndpointingPlan: { provider: "livekit" },
		},
		endCallPhrases: [
			"Thank you for your time. Your feedback will be returned right now.",
			"Thank you for participating in the IELTS Speaking Test. Your feedback will be provided shortly.",
		],
		model: {
			provider: "openai",
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content: `You are a professional IELTS examiner conducting a real-time voice speaking test with a candidate. Your goal is to assess their fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation.

                    Speaking Test Guidelines:
                    Follow the structured test flow:
					This simplified test has 2 parts
                    Part 1: Introduction and Interview (4-5 minutes)

                    On part 1, ask the folliwing questions: {{questions_part1}}
					- Do not say the question number, just ask the question.

			        Engage naturally & react appropriately:
			        Listen actively to responses and acknowledge them before moving forward.
			        Keep the conversation flowing smoothly while maintaining control.
			        Be professional, yet warm and welcoming:

			        Use official yet friendly language.
			        Keep responses concise and to the point (like in a real voice IELTS speaking test).
			        Avoid robotic phrasing—sound natural and conversational.

			        Conclude the exam properly by saying the same following phrases every time:
			        - This concludes the IELTS Speaking Test. Thank you for your time.
			        - Your feedback on the test will be returned right now.
			        End the conversation on a polite and positive note.

			        - Be sure to be professional and polite.
			        - Keep all your responses short and simple. Use official language, but be kind and welcoming.
			        - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.
					- Do not tell the candidate how to answer the questions. Do not give them any hints or tips. Just ask the questions and wait for their response.`,
				},
			],
		},
		// @ts-expect-error typecript error
		clientMessages: [],
		// @ts-expect-error typecript error
		serverMessages: [],
	};
	return examiner;
};

export const configureAssistantPart2and3 = (voice: string, style: string) => {
	const voiceId =
		voices[voice as keyof typeof voices][
			style as keyof (typeof voices)[keyof typeof voices]
		] || "sarah";

	const examiner: CreateAssistantDTO = {
		name: "Examiner",
		firstMessage:
			"Hello! Welcome to IELTS Speaking Test. My name is Wise AI, and I will be your examiner today. Let's talk about {{firstTopic}}. Please say 'im ready' to begin the test.",
		transcriber: {
			provider: "deepgram",
			model: "nova-3",
			language: "en",
		},
		voice: {
			provider: "11labs",
			voiceId: voiceId,
			stability: 0.4,
			similarityBoost: 0.8,
			speed: 1,
			style: 0.5,
			useSpeakerBoost: true,
		},
		silenceTimeoutSeconds: 80,
		maxDurationSeconds: 900,
		startSpeakingPlan: {
			waitSeconds: 2,
			smartEndpointingPlan: { provider: "livekit" },
		},
		endCallPhrases: [
			"Thank you for your time. Your feedback will be returned right now.",
			"Thank you for participating in the IELTS Speaking Test. Your feedback will be provided shortly.",
		],
		model: {
			provider: "openai",
			model: "gpt-4",
			messages: [
				{
					role: "system",
					content: `You are a professional IELTS examiner conducting a real-time voice speaking test with a candidate. Your goal is to assess their fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation.

                    Speaking Test Guidelines:
                    Follow the structured test flow:
					This simplified test has 2 parts
                    Part 1: Long Turn (1-2 minutes speaking after 1 minute preparation)
                    Part 2: Discussion (4-5 minutes)

                    On part 1, ask the candidate to speak for 1-2 minutes on the following topic: {{questions_part2}}. They will have 1 minute to prepare and the cue card will be provided. Say the exact phrase every time: - you will have 1 minute to prepare and tell me when you are ready to speak. If the candidate speaks for more than 2 minutes, politely interrupt them.
                    On part 2, ask the candidate to discuss the topic in more detail with the following questions: {{questions_part3}}. This part should last about 4-5 minutes. If time runs out, politely inform the candidate that the test is over.
					- Do not say the question number, just ask the question.

			        Engage naturally & react appropriately:
			        Listen actively to responses and acknowledge them before moving forward.
			        Keep the conversation flowing smoothly while maintaining control.
			        Be professional, yet warm and welcoming:

			        Use official yet friendly language.
			        Keep responses concise and to the point (like in a real voice IELTS speaking test).
			        Avoid robotic phrasing—sound natural and conversational.

			        Conclude the exam properly by saying the same following phrases every time:
			        - This concludes the IELTS Speaking Test. Thank you for your time.
			        - Your feedback on the test will be returned right now.
			        End the conversation on a polite and positive note.

			        - Be sure to be professional and polite.
			        - Keep all your responses short and simple. Use official language, but be kind and welcoming.
			        - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.
					- Do not tell the candidate how to answer the questions. Do not give them any hints or tips. Just ask the questions and wait for their response.`,
				},
			],
		},
		// @ts-expect-error typecript error
		clientMessages: [],
		// @ts-expect-error typecript error
		serverMessages: [],
	};
	return examiner;
};
