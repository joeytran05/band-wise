"use client";

import SpeakingComponent from "@/components/SpeakingComponent";
import { getSpeakingSetForUser } from "@/lib/actions/test.action";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export enum TestPart {
	part1 = "Part 1",
	part2 = "Part 2",
	part3 = "Part 3",
}

enum TestMode {
	FULL = "full",
	PART1 = "part1",
	PART2AND3 = "part2and3",
}

const testDescriptions = {
	part1: "Introduction & Interview",
	part2: "Long Turn — 1-minute preparation, 1–2 minutes speaking",
	part3: "Discussion on abstract ideas",
};

const SpeakingTestSession = ({ params, searchParams }: TestSessionProps) => {
	const [testPart, setTestPart] = useState<TestPart>(TestPart.part1);
	const [questions, setQuestions] = useState<FullTestQuestions>();
	const [topics, setTopics] = useState<string[]>([]);

	const [id, setId] = useState<string>("");
	const [firstPartId, setFirstPartId] = useState<string>("");
	const [mode, setMode] = useState<TestMode>(TestMode.FULL);

	const { user, isSignedIn } = useUser();

	useEffect(() => {
		if (!user) return;

		const fetchData = async () => {
			const { id } = await params;
			const { mode } = await searchParams;

			const {
				firstTopic,
				secondTopic,
				part1,
				part2,
				part3,
				firstPartId,
			} = await getSpeakingSetForUser(id);

			setId(id);
			setFirstPartId(firstPartId);
			setMode(mode?.toLowerCase() as TestMode);
			setTopics([firstTopic, secondTopic]);
			setQuestions({ part1: part1, part2: part2, part3: part3 });

			if (!part2 || part3.length === 0) {
				redirect("/take-tests/speaking");
			}
		};

		fetchData();
	}, [user, params, searchParams]);

	if (!isSignedIn) return <RedirectToSignIn />;

	return (
		<main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
			<article className="flex rounded-border justify-between p-6 max-md:flex-col">
				<div className="flex items-center gap-2">
					<div
						className="size-[72px] flex items-center justify-center rounded-lg max-md:hidden"
						style={{ backgroundColor: "white" }}
					>
						<Image
							src={`/logo.svg`}
							alt="logo"
							width={35}
							height={35}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<p className="font-bold text-2xl">Speaking Test</p>
							{/* <div className="subject-badge max-sm:hidden">
								<span className="text-sm">{testPart}</span>
							</div> */}
						</div>
						<p className="text-lg">{`${testPart} - Topic: ${
							testPart === TestPart.part1
								? testDescriptions.part1
								: testPart === TestPart.part2
								? testDescriptions.part2
								: testDescriptions.part3
						}`}</p>
					</div>
				</div>
				<div className="items-start text-2xl max-md:hidden">
					{testPart === TestPart.part1
						? "4-5 minutes"
						: testPart === TestPart.part2
						? "2-3 minutes"
						: "4-5 minutes"}
				</div>
			</article>

			<SpeakingComponent
				userId={user.id!}
				userName={user.fullName!}
				userImage={user.imageUrl!}
				setId={id}
				firstPartId={firstPartId}
				questions={questions!}
				topics={topics}
				mode={mode!}
				setTestPart={setTestPart}
			/>
		</main>
	);
};

export default SpeakingTestSession;
