// app/capture/page.tsx
"use client";

import { CameraCapture } from "@/components/shared/CameraCapture";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function Page() {
	const router = useRouter();

	const handleCapture = (image: string) => {
		// Handle captured image
	};

	return (
		<div className="container max-w-md mx-auto p-4">
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" size="icon" onClick={() => router.back()}>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-2xl font-bold">Camera</h1>
			</div>

			<CameraCapture onCapture={handleCapture} />
		</div>
	);
}
