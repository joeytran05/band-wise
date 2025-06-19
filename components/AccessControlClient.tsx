"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTestAccessStore } from "@/stores/useTestAccessStore";

const AccessControlClient = () => {
	const router = useRouter();
	const [hasChecked, setHasChecked] = useState(false);
	const { testAccessAllowed, revokeAccess } = useTestAccessStore();

	useEffect(() => {
		if (hasChecked) return;

		console.log(testAccessAllowed);
		if (!testAccessAllowed) {
			router.replace("/take-tests/writing");
		} else {
			revokeAccess();
		}

		setHasChecked(true);
	}, [testAccessAllowed, router, revokeAccess, hasChecked]);

	return null;
};

export default AccessControlClient;
