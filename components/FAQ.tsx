"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
	return (
		<section id="faq">
			<h2 className="text-3xl font-bold text-center mb-8">
				Frequently Asked Questions
			</h2>
			<Accordion type="multiple" className="w-full">
				<AccordionItem value="q1">
					<AccordionTrigger className="text-lg font-semibold hover:cursor-pointer hover:text-primary hover:no-underline">
						How does the AI Speaking Test work?
					</AccordionTrigger>
					<AccordionContent>
						Our AI simulates a real IELTS examiner, asking questions
						and listening to your answers. It then gives instant
						feedback on pronunciation, fluency, grammar, and
						coherence.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="q2">
					<AccordionTrigger className="text-lg font-semibold hover:cursor-pointer hover:text-primary hover:no-underline">
						Is BandWise free to use?
					</AccordionTrigger>
					<AccordionContent>
						We offer a free tier with limited test attempts. To
						unlock unlimited speaking feedback and premium features,
						you can upgrade anytime.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="q3">
					<AccordionTrigger className="text-lg font-semibold hover:cursor-pointer hover:text-primary hover:no-underline">
						Can I track my progress?
					</AccordionTrigger>
					<AccordionContent>
						Yes! Our dashboard shows your band score trends,
						completed tests, and feedback history — so you can focus
						on what matters most.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="q4">
					<AccordionTrigger className="text-lg font-semibold hover:cursor-pointer hover:text-primary hover:no-underline">
						Is my data secure?
					</AccordionTrigger>
					<AccordionContent>
						Absolutely. We follow industry best practices to protect
						your data and never share your recordings or information
						with third parties.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</section>
	);
};

export default FAQ;
