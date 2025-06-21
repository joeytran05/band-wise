"use server";

import { createSupabaseClient } from "../supabase";
import { format, subDays, addDays } from "date-fns";

// export const getDailySpeakingBands = async (userId: string) => {
// 	const supabase = createSupabaseClient();

// 	const today = new Date();
// 	const sevenDaysAgo = subDays(today, 6);

// 	const { data, error } = await supabase
// 		.from("speaking_results")
// 		.select("created_at, total_score")
// 		.eq("user_id", userId)
// 		.gte("created_at", sevenDaysAgo.toISOString());

// 	if (error || !data) return [];

// 	// Group scores by date
// 	const scoreMap = new Map<string, number[]>();
// 	for (const result of data) {
// 		const day = format(new Date(result.created_at), "yyyy-MM-dd");
// 		if (!scoreMap.has(day)) scoreMap.set(day, []);
// 		scoreMap.get(day)!.push(result.total_score);
// 	}

// 	const roundToNearestHalf = (num: number): number => {
// 		return Math.round(num * 2) / 2;
// 	};

// 	// Fill in 7 days with band scores (carrying forward last known)
// 	const filledData: { day: string; band: number; target: number }[] = [];
// 	let lastKnownScore: number = 0;
// 	const target = 7;

// 	for (let i = 0; i < 7; i++) {
// 		const date = addDays(sevenDaysAgo, i);
// 		const key = format(date, "yyyy-MM-dd");
// 		const display = format(date, "MMM d");

// 		const scores = scoreMap.get(key);
// 		if (scores && scores.length > 0) {
// 			const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
// 			const rounded = roundToNearestHalf(avg);
// 			lastKnownScore = rounded;
// 			filledData.push({ day: display, band: rounded, target });
// 		} else {
// 			filledData.push({ day: display, band: lastKnownScore, target });
// 		}
// 	}

// 	return filledData;
// };

export const getUserTargetBand = async (userId: string): Promise<number> => {
	const supabase = createSupabaseClient();

	const { data: targetData, error: targetError } = await supabase
		.from("user_target_band")
		.select("target")
		.eq("user_id", userId)
		.single();

	if (targetError) {
		throw new Error(
			targetError.message || "Failed to fetch user target band"
		);
	}

	const targetBand: number = targetData?.target ?? 8;

	return targetBand;
};

export const getUserScoresWithTarget = async (
	userId: string
): Promise<ScoreData[] | null> => {
	const supabase = createSupabaseClient();

	// 1. Calculate date range for last 7 days (including today)
	const today = new Date();
	const startDate = subDays(today, 6); // 6 days before today = 7 days total including today
	const formattedStartDate = format(startDate, "yyyy-MM-dd");

	// 2. Fetch daily average scores from the view for the last 7 days
	const { data: scoresData, error: scoresError } = await supabase
		.from("user_daily_average_scores")
		.select("date, average_score")
		.eq("user_id", userId)
		.gte("date", formattedStartDate)
		.order("date", { ascending: true });

	if (scoresError) {
		throw new Error(
			scoresError.message || "Failed to fetch daily average scores"
		);
	}

	if (!scoresData || scoresData.length === 0) {
		return null;
	}

	// 3. Fetch target band for user
	const targetBand = await getUserTargetBand(userId);

	// 4. Create a map of date -> average_score for fast lookup
	const scoresMap: Record<string, number> = {};
	if (scoresData) {
		for (const entry of scoresData) {
			// Normalize date string YYYY-MM-DD
			const d = format(new Date(entry.date), "yyyy-MM-dd");
			scoresMap[d] = entry.average_score;
		}
	}

	// 5. Build full 7-day array filling missing days with previous day's score (carry forward)
	const result: ScoreData[] = [];
	let lastScore: number | null = null;

	for (let i = 0; i < 7; i++) {
		const dateObj = addDays(startDate, i);
		const key = format(dateObj, "yyyy-MM-dd");
		const displayDay = format(dateObj, "MMM d");

		if (scoresMap[key] !== undefined) {
			lastScore = scoresMap[key];
		}

		// If no score for this day, use last known score or 0 if none
		result.push({
			day: displayDay,
			band: lastScore ?? 0,
			target: targetBand,
		});
	}

	return result;
};

export const getUserOnboardingStatus = async (
	userId: string
): Promise<boolean> => {
	const supabase = createSupabaseClient();

	const { data, error } = await supabase
		.from("user_target_band")
		.select("onboarded")
		.eq("user_id", userId)
		.single();

	if (error || !data) {
		return false;
	}

	return data.onboarded;
};

export const upsertUserTargetBand = async (userId: string, target: number) => {
	const supabase = createSupabaseClient();

	const { error } = await supabase.from("user_target_band").upsert(
		{ user_id: userId, target, onboarded: true },
		{ onConflict: "user_id" } // 💡 make sure your DB has a unique constraint on user_id
	);

	if (error) {
		throw new Error(error.message || "Failed to upsert target band");
	}
};

export const getUserComponentResults = async (
	userId: string,
	// component: "Listening" | "Reading" | "Writing" | "Speaking"
	component: TestComponentType
): Promise<TestResult[]> => {
	const supabase = createSupabaseClient();

	const tableMap = {
		// Listening: "listening_results",
		// Reading: "reading_results",
		Writing: "writing_results",
		Speaking: "speaking_results",
	};

	const { data, error } = await supabase
		.from(tableMap[component])
		.select("id, set_id, total_score, created_at")
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(5);

	if (error) throw new Error(error.message);

	return data.map((item) => ({
		id: item.id,
		set_id: item.set_id,
		total_score: item.total_score,
		// topic: item.topic,
		date: item.created_at,
	}));
};
