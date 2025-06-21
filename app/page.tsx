import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import LandingNavBar from "@/components/LandingNavBar";
// import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { PricingTable } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Landing = async () => {
	const { userId } = await auth();
	const isSignedIn = !!userId;

	return (
		<main className="relative overflow-hidden">
			<div className="bg-primary max-h-lg">
				<p className="font-semibold text-white text-[12px] lg:text-xl text-center align-middle py-2">
					Start your IELTS journey today
				</p>
			</div>

			<LandingNavBar isSignedIn={isSignedIn} />

			<section className="text-center">
				<div className="relative">
					<Image
						src="/confetti-bg.png"
						alt="Confetti Background"
						fill
						className="object-cover pointer-events-none z-0 fade-bottom"
					/>
					<div className="relative z-10 pt-5 pb-10">
						{/* <Image
							src="/grad-cap.svg"
							alt="Cap"
							width={70}
							height={70}
							className="mx-auto mb-6"
						/> */}
						<Sparkles className="w-16 h-16 mx-auto mt-4 mb-6 text-pink-500 animate-pulse" />

						<h1 className="text-2xl font-extrabold">
							Achieve your desired
							<br />
							band score with{" "}
							<span className="text-primary">BandWise</span>
						</h1>
						{/* <button className="mt-6 px-6 py-3 rounded-full bg-red-500 text-white hover:brightness-110 transition font-semibold">
							Begin now
						</button> */}
						<div className="rainbow-border-wrapper overflow-hidden mt-6 ">
							<Link href={isSignedIn ? "/dashboard" : "#pricing"}>
								<Button className="bg-red-500 font-semibold !rounded-full !px-6 !py-3 w-full h-full cursor-pointer">
									{isSignedIn
										? "Go to Dashboard"
										: "Get Started"}
								</Button>
							</Link>
						</div>
					</div>
				</div>
			</section>

			<FeaturesSection />

			<TestimonialsSection />
			{/* <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fef9f9] via-white to-[#ffaeae]" /> */}

			{/* <PricingSection /> */}

			<div
				className="max-w-5xl mx-auto px-4 py-10 text-center mb-6"
				id="pricing"
			>
				<h2 className="text-3xl font-bold mb-4 text-gray-900">
					Choose Your Study Plan
				</h2>
				<p className="text-gray-600 mb-10">
					Upgrade to unlock personalized, AI-powered IELTS
					preparation.
				</p>
				<PricingTable />
			</div>

			<Footer />
		</main>
	);
};

export default Landing;
