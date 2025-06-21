import { PricingTable } from "@clerk/nextjs";
import FAQ from "@/components/FAQ";
import { Sparkles } from "lucide-react";

const Subscription = () => {
	return (
		<main className="relative overflow-hidden">
			{/* Background glow */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fef9f9] via-white to-[#ffaeae]" />

			<section className="text-center px-6 pt-12 pb-10 max-w-4xl mx-auto">
				<div className="flex justify-center mb-4">
					<Sparkles className="w-10 h-10 text-pink-500 animate-pulse" />
				</div>

				<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
					Why Choose <span className="text-primary">BandWise</span>?
				</h1>

				<p className="text-lg text-gray-700 mb-4 leading-relaxed">
					<span className="text-primary font-semibold">BandWise</span>{" "}
					is your AI-powered companion for mastering the IELTS exam.
					Get personalized learning paths, real-time speaking test
					sessions, and actionable writing feedback — all in one
					seamless experience.
				</p>

				<p className="text-lg text-gray-700">
					Whether you&apos;re aiming for academic or general training,
					our smart tools and mock tests are built to help you
					confidently achieve your target band score.
				</p>
			</section>

			{/* Pricing Plans */}
			<section className="max-w-6xl mx-auto px-4">
				<PricingTable />
			</section>

			{/* FAQ */}
			<section className="mt-20 max-w-5xl mx-auto px-4 pb-20">
				<FAQ />
			</section>
		</main>
	);
};

export default Subscription;
