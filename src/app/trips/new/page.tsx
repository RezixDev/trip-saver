// app/trips/new/page.tsx
"use client";

import { TripForm } from "@/components/forms/TripForm";
import { LocationPicker } from "@/components/shared/LocationPicker";
import { CameraCapture } from "@/components/shared/CameraCapture";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function Page() {
	const router = useRouter();
	const [images, setImages] = useState<string[]>([]);

	const handleCapture = (image: string) => {
		setImages((prev) => [...prev, image]);
	};

	return (
		<div className="p-4">
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" size="icon" onClick={() => router.back()}>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-2xl font-bold">New Trip</h1>
			</div>

			<div className="space-y-6">
				<TripForm />

				<div className="space-y-2">
					<h2 className="text-lg font-semibold">Location</h2>
					<LocationPicker />
				</div>

				<div className="space-y-2">
					<h2 className="text-lg font-semibold">Photos</h2>
					<CameraCapture onCapture={handleCapture} />

					{images.length > 0 && (
						<div className="grid grid-cols-2 gap-2 mt-4">
							{images.map((image, index) => (
								<div key={index} className="relative aspect-square w-full">
									<Image
										src={image}
										alt={`Captured ${index + 1}`}
										fill
										className="object-cover rounded-lg"
									/>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
