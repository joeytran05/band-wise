"use client";

import FeatureCard from "@/components/FeatureCard";
import {
	Mic,
	PencilLine,
	TrendingUp,
	Volume2,
	Brain,
	BookOpen,
} from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";

const features = [
	{
		title: "AI for Speaking Test",
		description: "Real-time speaking test with AI and instant feedback.",
		icon: Mic,
	},
	{
		title: "AI Writing Evaluation",
		description:
			"Get detailed scoring and suggestions on your writing tasks.",
		icon: PencilLine,
	},
	{
		title: "Progress Tracking",
		description: "Track your improvement with personalized analytics.",
		icon: TrendingUp,
	},
	{
		title: "Voice Practice",
		description: "Practice speaking with real-time AI voice interaction.",
		icon: Volume2,
	},
	{
		title: "Personalized Learning",
		description:
			"Smart suggestions based on your strengths and weaknesses.",
		icon: Brain,
	},
	{
		title: "Mock Test Bank",
		description:
			"Hundreds of Listening, Reading, Writing & Speaking tests.",
		icon: BookOpen,
	},
];

export default function FeatureSection() {
	return (
		<section id="features" className="py-16 bg-white">
			<div className="max-w-7xl mx-auto px-6 text-center">
				<h2 className="text-3xl font-bold mb-4">Why BandWise?</h2>
				<p className="text-gray-600 mb-10">
					Tools designed to help you master every IELTS section with
					AI precision.
				</p>

				{/* Mobile View */}
				<div className="block lg:hidden">
					<Carousel opts={{ loop: true }} className="w-full">
						<CarouselContent className="-ml-4">
							{features.map((feat, index) => (
								<CarouselItem
									key={feat.title}
									className="pl-4 basis-1/2"
								>
									<FeatureCard
										title={feat.title}
										description={feat.description}
										icon={feat.icon}
										highlight={index < 3}
										className={
											index < 3
												? "border-2 border-red-500 bg-white shadow-md"
												: "bg-gray-100"
										}
									/>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious className="left-2" />
						<CarouselNext className="right-2" />
					</Carousel>
				</div>

				{/* Desktop View */}
				<div className="hidden lg:grid grid-cols-3 gap-6 px-4">
					{features.map((feat, index) => (
						<FeatureCard
							key={feat.title}
							title={feat.title}
							description={feat.description}
							icon={feat.icon}
							highlight={index < 3}
							className={
								index < 3
									? "border-2 border-red-500 bg-white shadow-md"
									: "bg-gray-100"
							}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
