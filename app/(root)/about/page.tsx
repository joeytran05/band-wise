"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const AboutPage = () => {
	return (
		<div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
			{/* About Section */}
			<section>
				<h1 className="text-4xl font-bold mb-6 text-center">
					About BandWise
				</h1>
				<p className="text-gray-700 text-lg leading-relaxed text-center max-w-2xl mx-auto">
					BandWise is your AI-powered partner for IELTS preparation.
					We&apos;re on a mission to help test-takers reach their
					target band with real-time speaking tests, AI feedback, and
					personalized learning paths. Whether you&apos;re aiming for
					academic success, immigration, or career growth — we&apos;re
					here to guide your journey.
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
			<section id="faq">
				<h2 className="text-3xl font-bold text-center mb-8">
					Frequently Asked Questions
				</h2>
				<Accordion type="multiple" className="w-full">
					<AccordionItem value="q1">
						<AccordionTrigger>
							How does the AI Speaking Test work?
						</AccordionTrigger>
						<AccordionContent>
							Our AI simulates a real IELTS examiner, asking
							questions and listening to your answers. It then
							gives instant feedback on pronunciation, fluency,
							grammar, and coherence.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="q2">
						<AccordionTrigger>
							Is BandWise free to use?
						</AccordionTrigger>
						<AccordionContent>
							We offer a free tier with limited test attempts. To
							unlock unlimited speaking feedback and premium
							features, you can upgrade anytime.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="q3">
						<AccordionTrigger>
							Can I track my progress?
						</AccordionTrigger>
						<AccordionContent>
							Yes! Our dashboard shows your band score trends,
							completed tests, and feedback history — so you can
							focus on what matters most.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="q4">
						<AccordionTrigger>Is my data secure?</AccordionTrigger>
						<AccordionContent>
							Absolutely. We follow industry best practices to
							protect your data and never share your recordings or
							information with third parties.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</section>

			{/* Optional: Team Section */}
			{/* <section>
				<h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
				<p className="text-center text-muted-foreground">Coming soon...</p>
			</section> */}
		</div>
	);
};

export default AboutPage;
