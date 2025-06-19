"use server";

import { speakingFeedbackSchema, writingFeedbackSchema } from "@/constants";
import { createSupabaseClient } from "../supabase";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { PostgrestError } from "@supabase/supabase-js";

export const getRandomPart1Questions = async () => {
	const supabase = createSupabaseClient();

	const { count } = await supabase
		.from("speaking_first_part_sets")
		.select("id", { count: "exact", head: true });

	const randomId = Math.floor(Math.random() * (count || 0)) + 1;

	const { data: questions, error: error } = await supabase
		.from("speaking_first_part_sets")
		.select("id, order_id, topic, questions")
		.eq("order_id", randomId)
		.single();

	if (error || !questions) {
		throw new Error(error?.message || "No questions set found for part 1");
	}

	return questions as FirstPart;
};

export const getSpeakingSetForUser = async (id: string) => {
	const supabase = createSupabaseClient();

	const questions_part1 = await getRandomPart1Questions();

	const { data: questions, error } = await supabase
		.from("speaking_sets")
		.select("id, topic, cue_card, questions")
		.eq("id", id)
		.single();

	if (error || !questions) {
		throw new Error(
			error?.message || "No speaking set found for the given ID"
		);
	}

	return {
		firstTopic: questions_part1.topic,
		secondTopic: questions.topic,
		part1: questions_part1.questions,
		part2: questions.cue_card,
		part3: questions.questions,
		firstPartId: questions_part1.id,
	} as SpeakingSet;
};

export const getUniqueCompletedCount = async (userId: string, test: string) => {
	const supabase = createSupabaseClient();

	const testSelect = {
		speaking: "set_id_second",
		writing: "set_id",
	};

	type ResultRow = { set_id_second: string } | { set_id: string }; // set_id_second for speaking, set_id for the rest

	const { data: completedResults, error } = (await supabase
		.from(`${test}_results`)
		.select(testSelect[test as keyof typeof testSelect]) // Dynamically select the column based on the test type
		.eq("user_id", userId)) as unknown as {
		data: ResultRow[] | null;
		error: PostgrestError | null;
	}; // Type assertion to ensure data is treated as ResultRow[]

	if (error || !completedResults) {
		console.error("Failed to fetch results:", error?.message);
		return 0;
	}

	const uniqueResults = new Set(
		completedResults.map((result) => {
			if ("set_id_second" in result) {
				return result.set_id_second;
			} else {
				return result.set_id;
			}
		})
	);

	return uniqueResults.size;
};

export const getRandomSetId = async (userId: string, test: string) => {
	const supabase = createSupabaseClient();

	const testSelect = {
		speaking: "set_id_second",
		writing: "set_id",
	};

	type ResultRow = { set_id_second: string } | { set_id: string }; // set_id_second for speaking, set_id for the rest

	// 1. Get completed set IDs
	const { data: completed, error: completedError } = (await supabase
		.from(`${test}_results`)
		.select(testSelect[test as keyof typeof testSelect]) // Dynamically select the column based on the test type
		.eq("user_id", userId)) as unknown as {
		data: ResultRow[] | null;
		error: PostgrestError | null;
	}; // Type assertion to ensure data is treated as ResultRow[]

	if (completedError) {
		throw new Error(
			completedError?.message || "Error fetching completed sets"
		);
	}

	const completedIds = new Set(
		completed?.map((result) => {
			if ("set_id_second" in result) {
				return result.set_id_second;
			} else {
				return result.set_id;
			}
		})
	);

	// 2. Get all available sets
	const { data: sets, error: setsError } = await supabase
		.from(`${test}_sets`)
		.select("id, order_id");

	if (setsError || !sets || sets.length === 0) {
		throw new Error(setsError?.message || "No speaking sets available");
	}

	// 3. Filter out completed ones
	const uncompletedSets = sets.filter((set) => !completedIds.has(set.id));

	if (uncompletedSets.length === 0) {
		throw new Error("All speaking sets have been completed");
	}

	const randomIndex = Math.floor(Math.random() * uncompletedSets.length);
	return uncompletedSets[randomIndex].id;
};

export const getTopicAndId = async (test: string) => {
	const supabase = createSupabaseClient();

	const { data: sets, error } = await supabase
		.from(`${test}_sets`)
		.select("id, topic");

	if (error || !sets || sets.length === 0) {
		throw new Error(error?.message || "No sets found");
	}

	// Use a Map to ensure uniqueness by topic
	const uniqueTopicsMap = new Map<string, { id: string; topic: string }>();
	sets.forEach((set) => {
		if (!uniqueTopicsMap.has(set.topic)) {
			uniqueTopicsMap.set(set.topic, set);
		}
	});

	return {
		topics: sets,
		uniqueTopics: Array.from(uniqueTopicsMap.values()),
	};
};

export const getWritingSetForUser = async (id: string) => {
	const supabase = createSupabaseClient();

	const { data: set, error } = await supabase
		.from("writing_sets")
		.select(
			"id, topic, first_part_question, first_part_img_url, second_part_question"
		)
		.eq("id", id)
		.single();

	if (error || !set) {
		throw new Error(
			error?.message || "No writing set found for the given ID"
		);
	}

	return {
		topic: set.topic,
		firstPart: set.first_part_question,
		firstPartImgUrl: set.first_part_img_url,
		secondPart: set.second_part_question,
	} as WritingSet;
};

export const createSpeakingFeedback = async (
	params: CreateSpeakingFeedbackParams
) => {
	const { testId, firstPartId, userId, transcript } = params;
	const supabase = createSupabaseClient();

	try {
		const formattedTranscript = transcript
			.map(
				(senctence: { role: string; content: string }) =>
					`- ${senctence.role}: ${senctence.content}\n`
			)
			.join("");

		const {
			object: {
				total_score,
				category_scores,
				strengths,
				areas_for_improvement,
				final_assessment,
			},
		} = await generateObject({
			model: google("gemini-2.0-flash-001", {
				structuredOutputs: false,
			}),
			schema: speakingFeedbackSchema,
			prompt: `
        You are an AI IELTS examiner analyzing an IELTS mock speaking test. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 9 in the following areas with 9 being the highest and there are only whole scores or .5 scores (for example 9.0 or 8.5). Do not add categories other than the ones provided:
        - **Fluency and Coherence**: ability to talk with normal levels of continuity, rate and effort, and to link ideas and language together to form coherent, connected speech.
        - **Lexical Resource**: range of vocabulary at the test taker’s disposal, which will influence the range of topics which they can discuss, and the precision with which meanings are expressed and attitudes conveyed.
        - **Grammatical Range and Accuracy**: accurate and appropriate use of syntactic forms in order to meet Speaking test requirements, and to the test taker’s range of grammatical resources, 
a feature which will help to determine the complexity of propositions which can be expressed.
        - **Pronunciation**: accurate and sustained use of a range of phonological features to convey meaningful messages.
		If the candidate did not answer anything in the transcript, return 0 for all categories.
		If the candidate did not answer a part of the test, reduce 2 points from the total score.
        `,
			system: "You are a professional IELTS examiner analyzing an IELTS mock speaking test. Your task is to evaluate the candidate based on structured categories",
		});

		const { data, error } = await supabase
			.from("speaking_results")
			.insert({
				user_id: userId,
				set_id_first: firstPartId,
				set_id_second: testId,
				total_score,
				category_scores,
				strengths,
				areas_for_improvement,
				final_assessment,
			})
			.select();

		if (error || !data)
			throw new Error(error?.message || "Failed to create feedback");

		return { success: true, feedbackId: data[0].set_id_second };
	} catch (e) {
		console.error("Error creating feedback:", e);
		return {
			success: false,
			feedbackId: "",
		};
	}
};

export const createWritingFeedback = async (
	params: CreateWritingFeedbackParams
) => {
	const { testId, userId, task1Question, task1, task2Question, task2 } =
		params;
	const supabase = createSupabaseClient();

	try {
		const {
			object: {
				total_score,
				category_scores,
				strengths,
				areas_for_improvement,
				final_assessment,
			},
		} = await generateObject({
			model: google("gemini-2.0-flash-001", {
				structuredOutputs: false,
			}),
			schema: writingFeedbackSchema,
			prompt: `
		You are an AI IELTS examiner analyzing a candidate’s Writing test. The candidate completed both Task 1 and Task 2 of the IELTS Academic Writing test.
		Your job is to critically evaluate the answers based on IELTS Writing Band Descriptors.
		Be objective and detailed.
		Do not be lenient — highlight weaknesses clearly, and penalize missing or underdeveloped content.

		---

		**Task 1 Question:**
		${task1Question}

		**Task 1 Response:**
		${task1}

		**Task 2 Question:**
		${task2Question}

		**Task 2 Response:**
		${task2}

		---

		Please score the candidate from 0 to 9 in the following areas. Scores must be either whole (e.g. 6.0) or half-band (e.g. 6.5). Do not add categories other than the ones provided:

		- **Task Response**: How well the candidate addresses all parts of the task, presents a clear position, and develops an argument with relevant ideas.
		- **Coherence and Cohesion**: How logically information is organized and ideas are linked with appropriate cohesive devices.
		- **Lexical Resource**: The variety and precision of vocabulary, collocations, and word choice.
		- **Grammatical Range and Accuracy**: The range and correctness of sentence structures, tenses, and grammar.

		Scoring Guidelines:
		- Use 0 for any category if the candidate submitted an empty answer.
		- If either Task 1 or Task 2 is completely missing, reduce 2 full band points from the total score.
		- Be honest and critical — the final score should reflect the candidate's weaknesses as well as their strengths.

		Return your evaluation as a structured object.
		`,
			system: "You are a professional IELTS Writing examiner evaluating both Writing Task 1 and Task 2. Follow IELTS Band Descriptors closely.",
		});

		const { data, error } = await supabase
			.from("writing_results")
			.insert({
				user_id: userId,
				set_id: testId,
				total_score,
				category_scores,
				strengths,
				areas_for_improvement,
				final_assessment,
			})
			.select();

		if (error || !data)
			throw new Error(error?.message || "Failed to create feedback");

		return { success: true, feedbackId: data[0].set_id };
	} catch (e) {
		console.error("Error creating feedback:", e);
		return {
			success: false,
			feedbackId: "",
		};
	}
};

export const getFeedbackById = async (params: GetFeedbackBySetIdParams) => {
	const supabase = createSupabaseClient();
	const { id, userId, test } = params;

	const testSelect = {
		speaking: "set_id_second",
		writing: "set_id",
	};

	const { data, error } = await supabase
		.from(`${test}_results`)
		.select("*")
		.eq(testSelect[test as keyof typeof testSelect], id)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (error || !data) {
		throw new Error(error?.message || "Feedback not found");
	}

	return data as Feedback;
};
