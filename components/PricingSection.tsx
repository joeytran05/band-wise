import { CheckCircle, Rocket, Users } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton } from "@clerk/nextjs";

const plans = [
	{
		title: "Free Plan",
		price: "Free",
		icon: Users,
		features: [
			"Basic mock tests",
			"3 Speaking Tests/week",
			"Limited AI feedbacks",
			"Personal Score Tracking",
		],
		bgColor: "bg-white",
		borderColor: "border-gray-300",
		textColor: "text-gray-800",
	},
	// {
	// 	title: "Pro Plan",
	// 	price: 19,
	// 	icon: Star,
	// 	features: [
	// 		"Full mock test access",
	// 		"AI speaking + writing evaluation",
	// 		"2 speaking test attempts per week",
	// 		"Personalized learning plan",
	// 	],
	// 	bgColor: "bg-gray-100",
	// 	borderColor: "border-gray-400",
	// 	textColor: "text-gray-900",
	// },
	{
		title: "Premium Plan",
		price: 39,
		icon: Rocket,
		features: [
			"Everything in Free",
			"Unlimited Speaking Tests with AI",
			"Peronalized AI feedback",
			"Access to Previous Tests Taken",
		],
		bgColor: "bg-gray-200",
		borderColor: "border-gray-500",
		textColor: "text-gray-900",
	},
];

const PricingSection = () => {
	return (
		<section id="pricing" className="mt-5 mb-20 bg-white max-w-5xl mx-auto">
			<div className="max-w-7xl mx-auto px-6 text-center">
				<h2 className="text-3xl font-bold mb-4 text-gray-900">
					Choose Your Study Plan
				</h2>
				<p className="text-gray-600 mb-10">
					Upgrade to unlock personalized, AI-powered IELTS
					preparation.
				</p>

				<div className="lg:flex lg:flex-row lg:justify-center lg:gap-6 flex flex-col gap-3">
					{plans.map(({ title, price, features, icon: Icon }) => (
						<div
							key={title}
							className="flex flex-col justify-between rounded-xl lg:w-5xl h-[370px] p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
						>
							<div className="flex flex-col items-center">
								<div className="flex justify-center mb-4">
									<Icon className="h-10 w-10 text-red-500" />
								</div>
								<h3 className="text-xl font-semibold mb-2 text-gray-800">
									{title}
								</h3>
								<p className="text-2xl font-bold mb-4 text-gray-900">
									{price === "Free"
										? "Free"
										: `$${price} / month`}
								</p>
							</div>

							<ul className="text-left space-y-3 text-sm text-gray-700">
								{features.map((feat, i) => (
									<li
										key={i}
										className="flex items-start gap-2"
									>
										<CheckCircle className="w-4 h-4 text-green-600 mt-1" />
										{feat}
									</li>
								))}
							</ul>
							{title === "Premium Plan" ? (
								<div className="rainbow-border-wrapper overflow-hidden mt-6 ">
									<SignInButton>
										<Button className="bg-red-500 font-semibold !rounded-full !px-6 !py-3 w-full h-full">
											Upgrade
										</Button>
									</SignInButton>
								</div>
							) : (
								<SignInButton>
									<Button className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded-full hover:brightness-110 transition">
										{title === "Free Plan"
											? "Get Started"
											: "Upgrade"}
									</Button>
								</SignInButton>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default PricingSection;
