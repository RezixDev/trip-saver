// app/trips/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Plus, MapPin, Calendar, Edit, Trash2, Download } from "lucide-react";
import Link from "next/link";
import { storage, type StorageItem } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

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
	const router = useRouter();

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

	useEffect(() => {
		loadTrips();
	}, []);

	const handleDelete = async (id: string) => {
		try {
			await storage.removeItem(id);
			await loadTrips(); // Refresh the list
			toast({
				title: "Success",
				description: "Trip deleted successfully",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to delete trip",
				variant: "destructive",
			});
		}
	};

	const handleExport = async () => {
		try {
			if (trips.length === 0) {
				toast({
					title: "No trips to export",
					description: "Create some trips first before exporting.",
					variant: "default",
				});
				return;
			}

			// Convert trips to CSV format
			const headers = [
				"Title",
				"Date",
				"Description",
				"Location",
				"Created At",
			].join(",");
			const rows = trips.map((trip) => {
				const data = trip.data as Trip;
				return [
					`"${data.title}"`,
					data.date,
					`"${data.description}"`,
					`"${data.location?.address || ""}"`,
					new Date(trip.timestamp).toLocaleString(),
				].join(",");
			});

			const csvContent = [headers, ...rows].join("\n");
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.setAttribute("href", url);
			link.setAttribute(
				"download",
				`trips-${new Date().toISOString().split("T")[0]}.csv`
			);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			toast({
				title: "Success",
				description: "Your trips have been exported to CSV",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to export trips",
				variant: "destructive",
			});
		}
	};

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
				<div className="flex gap-2">
					<Button
						variant="outline"
						onClick={handleExport}
						disabled={trips.length === 0}
					>
						<Download className="w-4 h-4 mr-2" />
						Export
					</Button>
					<Button asChild>
						<Link href="/trips/new">
							<Plus className="w-4 h-4 mr-2" />
							New Trip
						</Link>
					</Button>
				</div>
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
								<CardFooter className="flex justify-end gap-2">
									<Button variant="outline" size="sm" asChild>
										<Link href={`/trips/${trip.id}`}>
											<Edit className="w-4 h-4 mr-2" />
											Edit
										</Link>
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="destructive" size="sm">
												<Trash2 className="w-4 h-4 mr-2" />
												Delete
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Delete Trip</AlertDialogTitle>
												<AlertDialogDescription>
													Are you sure you want to delete this trip? This action
													cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDelete(trip.id)}
													className="bg-red-600 hover:bg-red-700"
												>
													Delete
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</CardFooter>
							</Card>
						);
					})}
				</div>
			)}
		</div>
	);
}
