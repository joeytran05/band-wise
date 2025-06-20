import React from "react";
import { Quote, Star } from "lucide-react";

const testimonials = [
	{
		text: "I improved my score significantly.",
		name: "Emily R.",
		title: "Language Tutor",
		color: "from-red-100 to-pink-100",
		rating: 5,
	},
	{
		text: "The feedback helped me ace the exam!",
		name: "David T.",
		title: "Graduate",
		// color: "from-blue-100 to-indigo-100",
		color: "from-red-100 to-pink-100",
		rating: 4,
	},
	{
		text: "The platform made studying enjoyable.",
		name: "Sophie L.",
		title: "High School Student",
		// color: "from-yellow-100 to-orange-100",
		color: "from-red-100 to-pink-100",
		rating: 4,
	},
	{
		text: "I felt prepared and confident on test day.",
		name: "Michael B.",
		title: "IT Specialist",
		// color: "from-green-100 to-emerald-100",
		color: "from-red-100 to-pink-100",
		rating: 5,
	},
];

const StarRating = ({ rating }: { rating: number }) => {
	return (
		<div className="flex gap-1 mb-2">
			{[...Array(5)].map((_, i) => (
				<Star
					key={i}
					className={`w-4 h-4 ${
						i < rating
							? "fill-yellow-400 text-yellow-400"
							: "text-gray-300"
					}`}
				/>
			))}
		</div>
	);
};

const TestimonialsSection = () => {
	return (
		<section
			id="testimonials"
			className="py-20 bg-gradient-to-b from-white to-gray-50"
		>
			<h2 className="text-center text-3xl font-bold mb-12 text-gray-800 px-10">
				Join our community of successful test-takers
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto">
				{testimonials.map(({ text, name, title, color, rating }) => (
					<div
						key={name}
						className={`bg-gradient-to-br ${color} p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden border border-transparent hover:border-white group`}
					>
						<Quote className="w-8 h-8 text-white/20 absolute top-4 right-4" />

						<StarRating rating={rating} />
						<p className="italic text-gray-800 group-hover:text-gray-900 mb-6 text-sm leading-relaxed transition-colors">
							“{text}”
						</p>

						<div className="pt-2 border-t border-white/30">
							<p className="font-semibold text-gray-900">
								{name}
							</p>
							<p className="text-xs text-gray-600">{title}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default TestimonialsSection;
