"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTestAccessStore } from "@/stores/useTestAccessStore";

const AccessControlClient = ({ route }: { route: string }) => {
	const router = useRouter();
	const [hasChecked, setHasChecked] = useState(false);
	const { testAccessAllowed, revokeAccess } = useTestAccessStore();

	useEffect(() => {
		if (hasChecked) return;

		if (!testAccessAllowed) {
			router.replace(`/take-tests/${route}`);
		} else {
			revokeAccess();
		}

		setHasChecked(true);
	}, [testAccessAllowed, router, revokeAccess, hasChecked, route]);

	return null;
};

export default AccessControlClient;
