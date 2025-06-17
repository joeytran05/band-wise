"use server";

import { feedbackSchema } from "@/constants";
import { createSupabaseClient } from "../supabase";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { format, subDays, addDays } from "date-fns";
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

export const createFeedback = async (params: CreateFeedbackParams) => {
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
			schema: feedbackSchema,
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

export const getFeedbackById = async (params: GetFeedbackBySetIdParams) => {
	const supabase = createSupabaseClient();
	const { id, userId } = params;

	const { data, error } = await supabase
		.from("speaking_results")
		.select("*")
		.eq("set_id_second", id)
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (error || !data) {
		throw new Error(error?.message || "Feedback not found");
	}

	return data as Feedback;
};

export const getDailySpeakingBands = async (userId: string) => {
	const supabase = createSupabaseClient();

	const today = new Date();
	const sevenDaysAgo = subDays(today, 6);

	const { data, error } = await supabase
		.from("speaking_results")
		.select("created_at, total_score")
		.eq("user_id", userId)
		.gte("created_at", sevenDaysAgo.toISOString());

	if (error || !data) return [];

	// Group scores by date
	const scoreMap = new Map<string, number[]>();
	for (const result of data) {
		const day = format(new Date(result.created_at), "yyyy-MM-dd");
		if (!scoreMap.has(day)) scoreMap.set(day, []);
		scoreMap.get(day)!.push(result.total_score);
	}

	const roundToNearestHalf = (num: number): number => {
		return Math.round(num * 2) / 2;
	};

	// Fill in 7 days with band scores (carrying forward last known)
	const filledData: { day: string; band: number; target: number }[] = [];
	let lastKnownScore: number = 0;
	const target = 7;

	for (let i = 0; i < 7; i++) {
		const date = addDays(sevenDaysAgo, i);
		const key = format(date, "yyyy-MM-dd");
		const display = format(date, "MMM d");

		const scores = scoreMap.get(key);
		if (scores && scores.length > 0) {
			const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
			const rounded = roundToNearestHalf(avg);
			lastKnownScore = rounded;
			filledData.push({ day: display, band: rounded, target });
		} else {
			filledData.push({ day: display, band: lastKnownScore, target });
		}
	}

	return filledData;
};
