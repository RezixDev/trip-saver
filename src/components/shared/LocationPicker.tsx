// components/shared/LocationPicker.tsx
"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";

interface LocationPickerProps {
	onLocationSelect?: (location: {
		latitude: number;
		longitude: number;
	}) => void;
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
	const { latitude, longitude, loading, error } = useGeolocation({
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
	});

	const handleSelect = () => {
		if (latitude && longitude && onLocationSelect) {
			onLocationSelect({ latitude, longitude });
		}
	};

	if (error) {
		return (
			<Card className="p-4">
				<p className="text-destructive">Error: {error}</p>
			</Card>
		);
	}

	return (
		<Card className="p-4">
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-medium">Current Location</h3>
					{loading && <Loader2 className="h-4 w-4 animate-spin" />}
				</div>

				{latitude && longitude ? (
					<>
						<div className="space-y-2">
							<p>Latitude: {latitude.toFixed(6)}</p>
							<p>Longitude: {longitude.toFixed(6)}</p>
						</div>
						<Button onClick={handleSelect} className="w-full">
							<MapPin className="mr-2 h-4 w-4" />
							Use This Location
						</Button>
					</>
				) : (
					<p className="text-muted-foreground">Waiting for location...</p>
				)}
			</div>
		</Card>
	);
}
