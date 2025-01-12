// components/shared/MobileNav.tsx
"use client";

import { Home, Camera, Map, Settings, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const MobileNav = () => {
	const pathname = usePathname();
	const router = useRouter();

	const navItems = [
		{ icon: Home, label: "Home", path: "/" },
		{ icon: Camera, label: "Capture", path: "/capture" },
		{ icon: Map, label: "Trips", path: "/trips" },
		{ icon: Settings, label: "Settings", path: "/settings" },
		{ icon: User, label: "Profile", path: "/profile" },
	];

	return (
		<nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
			<div className="flex justify-around items-center h-16 max-w-md mx-auto">
				{navItems.map(({ icon: Icon, label, path }) => (
					<button
						key={path}
						onClick={() => router.push(path)}
						className={cn(
							"flex flex-col items-center justify-center w-full h-full",
							"text-muted-foreground hover:text-primary transition-colors",
							pathname === path && "text-primary"
						)}
					>
						<Icon className="h-5 w-5" />
						<span className="text-xs mt-1">{label}</span>
					</button>
				))}
			</div>
		</nav>
	);
};

export default MobileNav;
