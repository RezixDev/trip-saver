// app/capture/page.tsx
"use client";

import { CameraCapture } from "@/components/shared/CameraCapture";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
	const router = useRouter();
	const { toast } = useToast();

	const handleCapture = async () => {
		try {
			// Handle the captured image
			toast({
				title: "Success",
				description: "Image captured successfully",
			});
		} catch (err) {
			toast({
				title: "Error",
				description: "Failed to save image" + err,
				variant: "destructive",
			});
		}
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
