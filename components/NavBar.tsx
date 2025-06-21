"use client";

import Link from "next/link";
import {
	SignInButton,
	SignedIn,
	SignedOut,
	UserButton,
	useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SideMenu from "@/components/SideMenu";

const NavBar = () => {
	const { isSignedIn } = useUser();

	return (
		<div className="flex items-center justify-between max-w-7xl mx-auto border-b p-4">
			{/* Side Menu */}
			<SideMenu isSignedIn={isSignedIn} />

			{/* Center section navigation links */}
			<div
				className={`hidden lg:flex flex-1 justify-center gap-15 ${
					isSignedIn ? "pr-38" : "pr-25"
				}`}
			>
				<Link
					href="/dashboard"
					className="text-gray-700 hover:text-red-500 transition"
				>
					Dashboard
				</Link>
				<Link
					href="/take-tests"
					className="text-gray-700 hover:text-red-500 transition"
				>
					Take Tests
				</Link>
				<Link
					href="/results"
					className="text-gray-700 hover:text-red-500 transition"
				>
					Results
				</Link>
			</div>

			{/* Right-side actions */}
			<div className="flex items-center gap-2">
				<SignedOut>
					<SignInButton>
						<Button variant="ghost">Sign In</Button>
					</SignInButton>
				</SignedOut>
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>
		</div>
	);
};

export default NavBar;
