// import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

// export const examiner: CreateAssistantDTO = {
// 	name: "Examiner",
// 	firstMessage:
// 		"Hello! Welcome to IELTS Speaking Test. My name is WiseAI, and I will be your examiner today. Let's talk about {{firstTopic}}.",
// 	transcriber: {
// 		provider: "deepgram",
// 		model: "nova-2",
// 		language: "en",
// 	},
// 	voice: {
// 		provider: "11labs",
// 		voiceId: "sarah",
// 		stability: 0.4,
// 		similarityBoost: 0.8,
// 		speed: 0.9,
// 		style: 0.5,
// 		useSpeakerBoost: true,
// 	},
// 	model: {
// 		provider: "openai",
// 		model: "gpt-4",
// 		messages: [
// 			{
// 				role: "system",
// 				content: `You are a professional IELTS examiner conducting a real-time voice speaking test with a candidate. Your goal is to assess their fluency and coherence, lexical resource, grammatical range and accuracy, and pronunciation.

// 							Speaking Test Guidelines:
// 							Follow the structured test flow:
// 							Part 1: Introduction and Interview (4-5 minutes)
// 							Part 2: Long Turn (1-2 minutes speaking after 1 minute preparation)
// 							Part 3: Discussion (4-5 minutes)

// 							On part 1, ask the folliwing questions: {{questions_part1}}
// 							On part 2, ask the candidate to speak for 1-2 minutes on the following topic: {{questions_part2}}. They will have 1 minute to prepare and the cue card will be provided. Say you will have 1 minute to prepare and wait for 1 minute before asking the candidate to start speaking. If the candidate speaks for more than 2 minutes, politely interrupt them.
// 							On part 3, ask the candidate to discuss the topic in more detail with the following questions: {{questions_part3}}. This part should last about 4-5 minutes. If time runs out, politely inform the candidate that the test is over.

// 							Engage naturally & react appropriately:
// 							Listen actively to responses and acknowledge them before moving forward.
// 							Ask brief follow-up questions if a response is vague or requires more detail.
// 							Keep the conversation flowing smoothly while maintaining control.
// 							Be professional, yet warm and welcoming:

// 							Use official yet friendly language.
// 							Keep responses concise and to the point (like in a real voice IELTS speaking test).
// 							Avoid robotic phrasing—sound natural and conversational.

// 							Conclude the exam properly:
// 							Thank the candidate for their time.
// 							Inform them that their feedback on the test will be return right now.
// 							End the conversation on a polite and positive note.

// 							- Be sure to be professional and polite.
// 							- Keep all your responses short and simple. Use official language, but be kind and welcoming.
// 							- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
// 			},
// 		],
// 	},
// };

export const voices = {
	male: { casual: "2BJW5coyhAzSr8STdHbE", formal: "c6SfcYrb2t09NHXiT80T" },
	female: { casual: "ZIlrSGI4jZqobxRKprJz", formal: "sarah" },
};

export const speakingFeedbackSchema = z.object({
	total_score: z.number(),
	category_scores: z.tuple([
		z.object({
			name: z.literal("Fluency and Coherence"),
			score: z.number(),
			comment: z.string(),
		}),
		z.object({
			name: z.literal("Lexical Resource"),
			score: z.number(),
			comment: z.string(),
		}),
		z.object({
			name: z.literal("Grammatical Range and Accuracy"),
			score: z.number(),
			comment: z.string(),
		}),
		z.object({
			name: z.literal("Pronunciation"),
			score: z.number(),
			comment: z.string(),
		}),
	]),
	strengths: z.array(z.string()),
	areas_for_improvement: z.array(z.string()),
	final_assessment: z.string(),
});

export const writingFeedbackSchema = z.object({
	total_score: z.number(),
	category_scores: z.tuple([
		z.object({
			name: z.literal("Task Response"),
			score: z.number(),
			comment: z.string(),
		}),
		z.object({
			name: z.literal("Coherence and Cohesion"),
			score: z.number(),
			comment: z.string(),
		}),
		z.object({
			name: z.literal("Lexical Resource"),
			score: z.number(),
			comment: z.string(),
		}),
		z.object({
			name: z.literal("Grammatical Range and Accuracy"),
			score: z.number(),
			comment: z.string(),
		}),
	]),
	strengths: z.array(z.string()),
	areas_for_improvement: z.array(z.string()),
	final_assessment: z.string(),
});

// export const dummyInterviews: Interview[] = [
//   {
//     id: "1",
//     userId: "user1",
//     role: "Frontend Developer",
//     type: "Technical",
//     techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
//     level: "Junior",
//     questions: ["What is React?"],
//     finalized: false,
//     createdAt: "2024-03-15T10:00:00Z",
//   },
//   {
//     id: "2",
//     userId: "user1",
//     role: "Full Stack Developer",
//     type: "Mixed",
//     techstack: ["Node.js", "Express", "MongoDB", "React"],
//     level: "Senior",
//     questions: ["What is Node.js?"],
//     finalized: false,
//     createdAt: "2024-03-14T15:30:00Z",
//   },
// ];

export const mockListeningQuestions = [
	{
		id: 1,
		type: "multiple_choice",
		question: "What is the main topic of the talk?",
		options: [
			"Health benefits of yoga",
			"History of yoga",
			"Different types of yoga",
			"Yoga and meditation",
		],
	},
	{
		id: 2,
		type: "fill_in_the_blank",
		question: "Yoga improves both ______ and physical health.",
	},
	{
		id: 3,
		type: "multiple_choice",
		question: "How long has the speaker been practicing yoga?",
		options: ["1 year", "5 years", "10 years", "Since childhood"],
	},
	{
		id: 4,
		type: "fill_in_the_blank",
		question: "One of the major benefits mentioned is increased ______.",
	},
];

export enum SpeakingTestPart {
	part1 = "Part 1",
	part2 = "Part 2",
	part3 = "Part 3",
}
