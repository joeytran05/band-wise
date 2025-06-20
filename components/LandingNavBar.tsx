"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "@/components/ui/drawer";
import DropDownMenu from "./DropDownMenu";

const navItems = [
	{ label: "Take Tests", href: "/take-tests" },
	{ label: "Previous Results", href: "/results" },
	{ label: "AI", href: "/ai" },
	{ label: "Personalized", href: "/personalized" },
];

const mockTestItems = [
	{ label: "Listening", href: "/take-tests/listening" },
	{ label: "Reading", href: "/take-tests/reading" },
	{ label: "Writing", href: "/take-tests/writing" },
	{ label: "Speaking", href: "/take-tests/speaking" },
];

const LandingNavBar = ({ isSignedIn }: { isSignedIn: boolean }) => {
	return (
		<div className="flex items-center justify-between max-w-7xl mx-auto border-b p-4">
			<div className="flex items-center gap-2">
				{/* Large screen menu */}
				<Drawer direction="left">
					<DrawerTrigger className="hidden lg:flex" asChild>
						<Button variant="ghost" size="icon">
							<Menu className="h-6 w-6" />
						</Button>
					</DrawerTrigger>
					<DrawerContent className="hidden lg:flex">
						<div className="p-4">
							<DrawerHeader>
								<DrawerTitle>Menu</DrawerTitle>
							</DrawerHeader>
							<nav className="flex flex-col gap-4 px-4">
								{navItems.map((item) =>
									item.label === "Take Tests" ? (
										<DropDownMenu
											key={item.href}
											trigger={
												<Link
													href="/take-tests"
													className="text-2xl font-medium"
												>
													Take Tests
												</Link>
											}
											content={
												<div className="flex flex-col gap-3 pl-5">
													{mockTestItems.map(
														(item) => (
															<Link
																className="text-lg"
																href={item.href}
																key={item.href}
															>
																{item.label}
															</Link>
														)
													)}
												</div>
											}
										/>
									) : (
										<Link
											key={item.href}
											href={item.href}
											className="text-2xl font-medium"
										>
											{item.label}
										</Link>
									)
								)}

								<DrawerClose asChild>
									<Button variant="outline" className="mt-6">
										Close
									</Button>
								</DrawerClose>
							</nav>
						</div>
					</DrawerContent>
				</Drawer>

				{/* Small screen menu */}
				<Drawer direction="bottom">
					<DrawerTrigger className="lg:hidden" asChild>
						<Button variant="ghost" size="icon">
							<Menu className="h-6 w-6" />
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className="p-4">
							<DrawerHeader>
								<DrawerTitle>Menu</DrawerTitle>
							</DrawerHeader>
							<nav className="flex flex-col gap-4 px-4">
								{navItems.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className="text-lg font-medium"
									>
										{item.label}
									</Link>
								))}
								<DrawerClose asChild>
									<Button variant="outline" className="mt-6">
										Close
									</Button>
								</DrawerClose>
							</nav>
						</div>
					</DrawerContent>
				</Drawer>

				<Link href="/" className="flex items-center gap-1">
					<Image
						src="/logo.svg"
						alt="Logo"
						width={25}
						height={25}
						className="cursor-pointer"
					/>
					<h3 className="text-black font-semibold text-lg">
						BandWise
					</h3>
				</Link>
			</div>

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
