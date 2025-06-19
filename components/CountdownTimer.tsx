const CountdownTimer = ({
	formatted,
	isTimeUp,
}: {
	formatted: string;
	isTimeUp: boolean;
}) => {
	return (
		<div className="text-sm text-right text-muted-foreground mt-4">
			<p className={isTimeUp ? "text-red-600 font-bold" : ""}>
				Time Left: {formatted}
			</p>
		</div>
	);
};

export default CountdownTimer;
