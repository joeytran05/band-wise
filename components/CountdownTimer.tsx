import { useEffect, useState } from "react";

const useCountdown = (minutes: number) => {
	const [timeLeft, setTimeLeft] = useState(minutes * 60);

	useEffect(() => {
		if (timeLeft <= 0) return;
		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [timeLeft]);

	const minutesLeft = Math.floor(timeLeft / 60);
	const secondsLeft = timeLeft % 60;
	const formatted = `${minutesLeft}:${secondsLeft
		.toString()
		.padStart(2, "0")}`;

	return { timeLeft, formatted, isTimeUp: timeLeft <= 0 };
};

const CountdownTimer = ({ minutes }: { minutes: number }) => {
	const { formatted, isTimeUp } = useCountdown(minutes);

	return (
		<div className="text-sm text-right text-muted-foreground mt-4">
			<p className={isTimeUp ? "text-red-600 font-bold" : ""}>
				Time Left: {formatted}
			</p>
		</div>
	);
};

export default CountdownTimer;
