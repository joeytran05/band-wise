"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SideMenu from "@/components/SideMenu";

const LandingNavBar = ({ isSignedIn }: { isSignedIn: boolean }) => {
	return (
		<div className="flex items-center justify-between max-w-7xl mx-auto border-b p-4">
			{/* SideMenu */}
			<SideMenu isSignedIn={isSignedIn} />

			{/* Center section navigation links */}
			<div
				className={`hidden lg:flex flex-1 justify-center ${
					isSignedIn ? "pr-30" : "pl-10"
				} gap-6`}
			>
				<Link
					href="#features"
					className="text-gray-700 hover:text-red-500 transition"
				>
					Features
				</Link>
				<Link
					href="#testimonials"
					className="text-gray-700 hover:text-red-500 transition"
				>
					Testimonials
				</Link>
				<Link
					href="#pricing"
					className="text-gray-700 hover:text-red-500 transition"
				>
					Study Plans
				</Link>
			</div>

			{/* Right-side actions */}
			<div className="flex items-center gap-2">
				<SignedOut>
					<SignInButton>
						<Button variant="ghost">Sign In</Button>
					</SignInButton>
					<Link href="#pricing">
						<Button className="btn-red-gradient">
							Get Started
						</Button>
					</Link>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</div>
	);
};

export default LandingNavBar;
