"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import {
	getUserTargetBand,
	upsertUserTargetBand,
} from "@/lib/actions/dashboard.action";

const validBands = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

const TargetBandModal = () => {
	const { user } = useUser();
	const [target, setTarget] = useState("");
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const handleOpen = async () => {
			if (!user?.id) return;
			setLoading(true);
			const existing = await getUserTargetBand(user.id);
			if (existing) setTarget(existing.toString());
			setLoading(false);
		};

		if (open) {
			handleOpen();
		}
	}, [open, user?.id]);

	const handleSave = async () => {
		const value = parseFloat(target);
		if (!validBands.includes(value)) {
			setMessage("⚠️ Band must be between 4.0 and 9.0 (step 0.5)");
			return;
		}
		if (!user?.id) return;
		setSaving(true);
		await upsertUserTargetBand(user.id, value);
		setMessage("✅ Target band saved!");
		setSaving(false);
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline">🎯 Set Target Band</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						Set Your Target Band
					</DialogTitle>
				</DialogHeader>
				<p className="text-muted-foreground text-sm mb-2">
					This will be used to track your progress.
				</p>
				<Input
					type="number"
					step={0.5}
					min={4}
					max={9}
					value={target}
					onChange={(e) => setTarget(e.target.value)}
					disabled={loading || saving}
					placeholder="Enter band (e.g. 7.5)"
				/>
				{message && (
					<p className="text-sm mt-1 text-green-600">{message}</p>
				)}
				<div className="flex justify-end mt-4">
					<Button onClick={handleSave} disabled={saving}>
						{saving ? "Saving..." : "Save"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default TargetBandModal;
