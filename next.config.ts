import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "img.clerk.com" },
			{ hostname: "wafsdjnmvgpkhnavjpzu.supabase.co" },
		],
	},
};

export default nextConfig;
