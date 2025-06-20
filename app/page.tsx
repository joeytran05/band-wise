import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import LandingNavBar from "@/components/LandingNavBar";
// import PricingSection from "@/components/PricingSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import { Button } from "@/components/ui/button";
import { PricingTable } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Landing = async () => {
	const { userId } = await auth();
	const isSignedIn = !!userId;

	return (
		<main>
			<div className="bg-primary max-h-lg">
				<p className="font-semibold text-white text-[12px] lg:text-xl text-center align-middle py-2">
					Start your IELTS journey today
				</p>
			</div>

			<LandingNavBar isSignedIn={isSignedIn} />

			<section className="text-center bg-white">
				<div className="relative">
					<Image
						src="/confetti-bg.png"
						alt="Confetti Background"
						fill
						className="object-cover pointer-events-none z-0"
					/>
					<div className="relative z-10 pt-5 pb-10">
						<Image
							src="/grad-cap.svg"
							alt="Cap"
							width={70}
							height={70}
							className="mx-auto mb-6"
						/>
						<h1 className="text-2xl font-extrabold">
							Achieve your desired
							<br />
							band score with BandWise
						</h1>
						{/* <button className="mt-6 px-6 py-3 rounded-full bg-red-500 text-white hover:brightness-110 transition font-semibold">
							Begin now
						</button> */}
						<div className="rainbow-border-wrapper overflow-hidden mt-6 ">
							<Link href={isSignedIn ? "/dashboard" : "#pricing"}>
								<Button className="bg-red-500 font-semibold !rounded-full !px-6 !py-3 w-full h-full">
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

			{/* <PricingSection /> */}

			<PricingTable />

			<Footer />
		</main>
	);
};

export default Landing;
