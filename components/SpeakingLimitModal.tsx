"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SpeakingLimitModal = () => {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setOpen(true);
	}, []);

	const onOpen = () => {
		setOpen(!open);
		redirect("/take-tests");
	};

	return (
		<Dialog open={open} onOpenChange={onOpen}>
			<DialogContent className="max-w-md text-center">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-center">
						You&apos;ve reached your weekly limit
					</DialogTitle>
					<DialogDescription className=""></DialogDescription>
				</DialogHeader>
				<article className="w-full text-center">
					<div className="bg-[#fccc41] rounded-4xl px-3 py-1.5 text-black font-semibold inline-block">
						Upgrade Your Plan
					</div>
					{/* <h1 className="text-xl font-semibold mt-4">
								You&apos;ve already taken 3 speaking tests this
								week.
							</h1> */}
					<p className="text-gray-600 mt-2">
						Upgrade your plan to unlock unlimited speaking practice
						and detailed feedback.
					</p>
				</article>
				<Button
					onClick={() => router.push("/subscription")}
					className="mt-4 w-full hover:bg-red-600 text-white"
				>
					Upgrade Now
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default SpeakingLimitModal;
