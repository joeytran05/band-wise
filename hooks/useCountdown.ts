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

export default useCountdown;
