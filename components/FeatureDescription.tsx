"use client";

import React, { useEffect, useState } from "react";
import DropDownMenu from "./DropDownMenu";

const FeatureDescription = ({ content }: { content: React.ReactNode }) => {
	const [isMobile, setIsMobile] = useState<boolean | null>(null);

	useEffect(() => {
		setIsMobile(window.innerWidth < 768);
	}, []);

	if (isMobile === null) {
		return (
			<div className="mt-6 px-4 bg-blue-50 rounded-md text-sm text-blue-900 animate-pulse h-16" />
		);
	}

	return (
		<div className="mt-6 px-4 bg-blue-50 rounded-md text-sm text-blue-900">
			<DropDownMenu
				defaultValue={!isMobile ? "item-1" : ""}
				trigger={<h3 className="font-semibold mb-2">How It Works</h3>}
				content={content}
			/>
		</div>
	);
};

export default FeatureDescription;
