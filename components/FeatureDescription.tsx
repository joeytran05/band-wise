"use client";

import React, { useEffect, useState } from "react";
import DropDownMenu from "./DropDownMenu";

const FeatureDescription = ({ content }: { content: React.ReactNode }) => {
	const [showTips, setShowTips] = useState<boolean>(true);

	useEffect(() => {
		const screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			setShowTips(false);
		}
	}, []);

	return (
		<div className="mt-6 px-4 bg-blue-50 rounded-md text-sm text-blue-900">
			<DropDownMenu
				defaultValue={showTips ? "item-1" : ""}
				trigger={<h3 className="font-semibold mb-2">How It Works</h3>}
				content={content}
			/>
		</div>
	);
};

export default FeatureDescription;
