import { LucideIcon } from "lucide-react";

type FeatureCardProps = {
	title: string;
	description: string;
	icon: LucideIcon;
	highlight?: boolean;
	className?: string;
};

const FeatureCard = ({
	title,
	description,
	icon: Icon,
	highlight,
	className,
}: FeatureCardProps) => {
	return (
		<div
			className={`p-6 rounded-lg flex flex-col items-center text-center gap-4 hover:shadow-xl transition-all duration-300 ${className}`}
		>
			{highlight && (
				<span className="text-xs px-2 py-1 bg-yellow-300 text-yellow-900 rounded-full font-semibold uppercase">
					Top Feature
				</span>
			)}
			<Icon className="w-10 h-10 text-red-500" />
			<h3 className="text-xl font-semibold">{title}</h3>
			<p className="text-gray-600">{description}</p>
		</div>
	);
};

export default FeatureCard;
