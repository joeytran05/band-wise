import FAQ from "@/components/FAQ";
import { Sparkles } from "lucide-react";

const AboutPage = () => {
	return (
		<main className="max-w-4xl mx-auto px-6 pt-10 pb-16 space-y-16">
			{/* About Section */}

			<section className="text-center px-6 pb-5 max-w-4xl mx-auto">
				<div className="flex justify-center mb-4">
					<Sparkles className="w-10 h-10 text-pink-500 animate-pulse" />
				</div>

				<h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6">
					About <span className="text-primary">BandWise</span>?
				</h1>

				<p className="text-lg text-gray-700 mb-4 leading-relaxed">
					<span className="text-primary font-semibold">BandWise</span>{" "}
					is your AI-powered partner for IELTS preparation. We&apos;re
					on a mission to help test-takers reach their target band
					with real-time speaking tests, AI feedback, and personalized
					learning paths.
				</p>

				<p className="text-lg text-gray-700">
					Whether you&apos;re aiming for academic or general training,
					our smart tools and mock tests are built to help you
					confidently achieve your target band score.
				</p>
			</section>

			{/* Vision & Mission */}
			<section className="grid md:grid-cols-2 gap-10">
				<div>
					<h2 className="text-2xl font-semibold mb-3">
						🎯 Our Mission
					</h2>
					<p className="text-gray-600 leading-relaxed">
						To make IELTS preparation smarter, faster, and more
						accessible using the latest in AI and education
						technology.
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold mb-3">
						🌟 Our Vision
					</h2>
					<p className="text-gray-600 leading-relaxed">
						To become the most trusted and innovative IELTS platform
						for students worldwide, helping millions achieve their
						dreams.
					</p>
				</div>
			</section>

			{/* FAQ Section */}
			<FAQ />

			{/* Optional: Team Section */}
			{/* <section>
				<h2 className="text-3xl font-bold text-center mb-8">
					Meet the Team
				</h2>
				<p className="text-center text-muted-foreground">
					Coming soon...
				</p>
			</section> */}
		</main>
	);
};

export default AboutPage;
