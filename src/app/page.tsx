// app/page.tsx
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
	return (
		<div className="container max-w-md mx-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold">PWA App</h1>
			</div>

			<div className="space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>New Trip</CardTitle>
						<CardDescription>
							Create a new trip with photos and location
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild className="w-full">
							<Link href="/trips/new">Start New Trip</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Camera</CardTitle>
						<CardDescription>Take photos and save them offline</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild className="w-full">
							<Link href="/capture">Open Camera</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
