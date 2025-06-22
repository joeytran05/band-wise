import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/next";

const workSans = Work_Sans({
	variable: "--font-work-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "BandWise",
	description: "An AI-powered IELTS learning platform",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider appearance={{ variables: { colorPrimary: "#EF4444" } }}>
			<html lang="en">
				<body className={`${workSans.className} antialiased`}>
					{children}
					<Toaster position="top-center" />
					<Analytics />
				</body>
			</html>
		</ClerkProvider>
	);
}
