import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerClose,
} from "@/components/ui/drawer";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const navItemsLarge = [
	{ label: "Dashboard", href: "/dashboard" },
	{ label: "Take Tests", href: "/take-tests" },
	{ label: "Previous Results", href: "/results" },
	{ label: "Landing", href: "/" },
	{ label: "Subscription", href: "/subscription" },
	{ label: "About Us", href: "/about" },
	{ label: "FAQ", href: "/about#faq" },
];

const navItemsSmall = [
	{ label: "Dashboard", href: "/dashboard" },
	{ label: "Take Tests", href: "/take-tests" },
	{ label: "Previous Results", href: "/results" },
	{ label: "Landing", href: "/" },
	{ label: "Subscription", href: "/subscription" },
	{ label: "About Us", href: "/about" },
];

const SideMenu = ({ isSignedIn }: { isSignedIn: boolean | undefined }) => {
	return (
		<div className="flex items-center gap-2">
			{/* Large Screen Menu */}
			<Drawer direction="left">
				<DrawerTrigger className="hidden lg:flex" asChild>
					<Button
						variant="ghost"
						size="icon"
						className="cursor-pointer"
					>
						<Menu className="h-6 w-6" />
					</Button>
				</DrawerTrigger>

				<DrawerContent className="hidden lg:flex w-[300px] bg-white dark:bg-neutral-900 border-r shadow-lg">
					<div className="flex flex-col h-full py-6 px-5">
						<DrawerHeader>
							<DrawerTitle className="text-2xl font-bold">
								Menu
							</DrawerTitle>
						</DrawerHeader>

						<nav className="mt-6 px-4 flex flex-col gap-4 text-lg text-gray-700 dark:text-gray-200">
							{navItemsLarge.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`text-lg font-semibold hover:text-primary transition ${
										item.label === "Landing"
											? "border-t-1 border-black pt-10 mt-5"
											: ""
									}`}
								>
									{item.label}
								</Link>
							))}
						</nav>

						<div className="mt-auto pt-6">
							<DrawerClose asChild>
								<Button
									variant="secondary"
									className="w-full text-base font-medium hover:bg-gray-200 transition cursor-pointer"
								>
									Close
								</Button>
							</DrawerClose>
						</div>
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
							{navItemsSmall.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className={`text-lg font-medium ${
										item.label === "Landing"
											? "border-t-1 border-black pt-3"
											: ""
									}`}
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

			<Link
				href={isSignedIn ? "/dashboard" : "/"}
				className="flex items-center gap-1"
			>
				<Image
					src="/logo.svg"
					alt="Logo"
					width={25}
					height={25}
					className="cursor-pointer"
				/>
				<h3 className="text-black font-semibold text-lg">BandWise</h3>
			</Link>
		</div>
	);
};

export default SideMenu;
