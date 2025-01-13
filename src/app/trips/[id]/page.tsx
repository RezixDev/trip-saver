// app/trips/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { TripForm } from "@/components/forms/TripForm";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { storage, type TripData, type StorageItem } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
	const params = useParams();
	const router = useRouter();
	const { toast } = useToast();
	const [trip, setTrip] = useState<StorageItem<TripData> | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function loadTrip() {
			try {
				const tripData = await storage.getItem(params.id as string);
				if (!tripData) {
					toast({
						title: "Error",
						description: "Trip not found",
						variant: "destructive",
					});
					router.push("/trips");
					return;
				}
				setTrip(tripData);
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to load trip" + error,
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		}

		loadTrip();
	}, [params.id, router, toast]);

	if (loading) {
		return (
			<div className="p-4">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-muted rounded w-1/3" />
					<div className="h-32 bg-muted rounded" />
				</div>
			</div>
		);
	}

	return (
		<div className="p-4">
			<div className="flex items-center gap-4 mb-6">
				<Button variant="ghost" size="icon" onClick={() => router.back()}>
					<ArrowLeft className="h-5 w-5" />
				</Button>
				<h1 className="text-2xl font-bold">Edit Trip</h1>
			</div>

			{trip && <TripForm initialData={trip.data} id={trip.id} />}
		</div>
	);
}
