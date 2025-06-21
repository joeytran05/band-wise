"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";

const MicTest = () => {
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const [recording, setRecording] = useState(false);
	const chunks = useRef<Blob[]>([]);

	const handleRecordToggle = async () => {
		if (!recording) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				const recorder = new MediaRecorder(stream);
				mediaRecorderRef.current = recorder;
				chunks.current = [];

				recorder.ondataavailable = (e) => chunks.current.push(e.data);
				recorder.onstop = () => {
					const blob = new Blob(chunks.current, {
						type: "audio/webm",
					});
					const url = URL.createObjectURL(blob);

					// Clean up media stream
					stream.getTracks().forEach((track) => track.stop());

					// Automatically play
					const audio = new Audio(url);
					audio.play();
				};

				recorder.start();
				setRecording(true);
			} catch (err) {
				alert("Microphone access denied or unavailable.");
				console.error(err);
			}
		} else {
			mediaRecorderRef.current?.stop();
			setRecording(false);
			toast.success(
				"Recording stopped. Audio played back automatically."
			);
		}
	};

	return (
		<div className="">
			<Button
				onClick={handleRecordToggle}
				variant={recording ? "destructive" : "outline"}
				className="flex items-center gap-2"
			>
				{recording ? (
					<>
						<StopCircle className="w-4 h-4" /> Stop & Playback
					</>
				) : (
					<>
						<Mic className="w-4 h-4" /> Start Mic Test
					</>
				)}
			</Button>
		</div>
	);
};

export default MicTest;
