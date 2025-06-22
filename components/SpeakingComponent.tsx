"use client";

import Image from "next/image";
import { useState } from "react";
import { SpeakingTestPart } from "@/constants";
import { RedirectToSignIn, useUser } from "@clerk/nextjs";
import SpeakingVapiModel from "./SpeakingVapiModel";

const testDescriptions = {
	part1: "Introduction & Interview",
	part2: "Long Turn — 1-minute preparation, 1–2 minutes speaking",
	part3: "Discussion on abstract ideas",
};

const SpeakingComponent = ({
	firstTopic,
	secondTopic,
	part1,
	part2,
	part3,
	firstPartId,
	setId,
	mode,
}: SpeakingComponentProps) => {
	const [testPart, setTestPart] = useState<SpeakingTestPart>(
		SpeakingTestPart.part1
	);
	const { user } = useUser();
	if (!user) return <RedirectToSignIn />;

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
							testPart === SpeakingTestPart.part1
								? testDescriptions.part1
								: testPart === SpeakingTestPart.part2
								? testDescriptions.part2
								: testDescriptions.part3
						}`}</p>
					</div>
				</div>
				<div className="items-start text-2xl max-md:hidden">
					{testPart === SpeakingTestPart.part1
						? "4-5 minutes"
						: testPart === SpeakingTestPart.part2
						? "2-3 minutes"
						: "4-5 minutes"}
				</div>
			</article>

			<SpeakingVapiModel
				userId={user.id!}
				userName={user.fullName!}
				userImage={user.imageUrl!}
				setId={setId}
				firstPartId={firstPartId}
				questions={{ part1, part2, part3 } as FullTestQuestions}
				topics={[firstTopic, secondTopic] as string[]}
				mode={mode!}
				setTestPart={setTestPart}
			/>
		</main>
	);
};

export default SpeakingComponent;
