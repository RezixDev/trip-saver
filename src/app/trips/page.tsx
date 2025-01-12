"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MapPin, Calendar } from "lucide-react";
import Link from "next/link";
import { storage, type StorageItem } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

type Trip = {
	title: string;
	date: string;
	description: string;
	location?: {
		latitude?: number;
		longitude?: number;
		address?: string;
	};
};

export default function Page() {
	const [trips, setTrips] = useState<StorageItem[]>([]);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		async function loadTrips() {
			try {
				const items = await storage.getItems("form");
				setTrips(items);
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to load trips",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		}

		loadTrips();
	}, [toast]);

	if (loading) {
		return (
			<div className="p-4">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-2xl font-bold">My Trips</h1>
					<Button asChild>
						<Link href="/trips/new">
							<Plus className="w-4 h-4 mr-2" />
							New Trip
						</Link>
					</Button>
				</div>
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Card key={i} className="animate-pulse">
							<CardHeader>
								<div className="h-6 bg-muted rounded w-1/3" />
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<div className="h-4 bg-muted rounded w-1/2" />
									<div className="h-4 bg-muted rounded w-1/4" />
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="p-4">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">My Trips</h1>
				<Button asChild>
					<Link href="/trips/new">
						<Plus className="w-4 h-4 mr-2" />
						New Trip
					</Link>
				</Button>
			</div>

			{trips.length === 0 ? (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-8 text-center">
						<div className="rounded-full bg-primary/10 p-3 mb-4">
							<MapPin className="w-6 h-6 text-primary" />
						</div>
						<h2 className="text-lg font-semibold mb-2">No trips yet</h2>
						<p className="text-muted-foreground mb-4">
							Create your first trip to get started
						</p>
						<Button asChild>
							<Link href="/trips/new">
								<Plus className="w-4 h-4 mr-2" />
								Create Trip
							</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{trips.map((trip) => {
						const data = trip.data as Trip;
						return (
							<Card key={trip.id}>
								<CardHeader>
									<CardTitle>{data.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-2">
										<div className="flex items-center text-muted-foreground">
											<Calendar className="w-4 h-4 mr-2" />
											<span>{new Date(data.date).toLocaleDateString()}</span>
										</div>
										{data.location?.address && (
											<div className="flex items-center text-muted-foreground">
												<MapPin className="w-4 h-4 mr-2" />
												<span>{data.location.address}</span>
											</div>
										)}
										<p className="text-sm text-muted-foreground line-clamp-2">
											{data.description}
										</p>
									</div>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
