import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaAppStoreIos } from "react-icons/fa";
import { FaGooglePlay } from "react-icons/fa";

const Footer = () => {
	return (
		<footer className="py-12 bg-white border-t">
			<div className="lg:flex lg:flex-row lg:justify-between flex flex-col gap-8 max-w-6xl mx-auto px-4 text-sm">
				<div className="flex flex-col items-center">
					<p className="font-bold mb-2">IELTS BandWise</p>
					<Image
						src="/black-logo-name.svg"
						alt="logo"
						width={150}
						height={50}
					/>
				</div>
				<div>
					<p className="font-bold mb-2">Learn more about us</p>
					<ul className="space-y-1">
						<Link href="/about">
							<li>About Us</li>
						</Link>
						<Link href="/subscription">
							<li>Subscriptions</li>
						</Link>
					</ul>
				</div>
				<div>
					<p className="font-bold mb-2">Customer assistance</p>
					<ul className="space-y-1">
						<li>Contact support</li>
						<Link href="/about">
							<li>FAQ</li>
						</Link>
					</ul>
				</div>
				<div>
					<p className="font-bold mb-2">Join our community</p>
					<ul className="space-y-1">
						<li>Facebook</li>
						<li>Instagram</li>
						<li>Twitter</li>
						<li>Discord</li>
					</ul>
				</div>
				<div>
					<p className="font-bold mb-2">Get the app</p>
					<div className="flex flex-col gap-2">
						<FaAppStoreIos className="w-8 h-8 text-gray-700" />
						<FaGooglePlay className="w-8 h-8 text-gray-700" />
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
