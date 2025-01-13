// components/shared/CameraCapture.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, SwitchCamera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
	onCapture: (image: string) => void;
}

export const CameraCapture = ({ onCapture }: CameraCaptureProps) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [facingMode, setFacingMode] = useState<"user" | "environment">(
		"environment"
	);
	const { toast } = useToast();

	const startCamera = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode },
			});
			setStream(mediaStream);
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
			}
		} catch (error) {
			toast({
				title: "Camera Error",
				description:
					"Unable to access camera. Please check permissions." + error,
				variant: "destructive",
			});
		}
	};

	const stopCamera = () => {
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			setStream(null);
		}
	};

	const capturePhoto = () => {
		if (videoRef.current) {
			const canvas = document.createElement("canvas");
			canvas.width = videoRef.current.videoWidth;
			canvas.height = videoRef.current.videoHeight;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.drawImage(videoRef.current, 0, 0);
				const imageData = canvas.toDataURL("image/jpeg");
				onCapture(imageData);
				stopCamera();
			}
		}
	};

	const toggleCamera = () => {
		stopCamera();
		setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
		startCamera();
	};

	return (
		<Card className="p-4">
			<div className="relative aspect-video rounded-lg overflow-hidden bg-black">
				<video
					ref={videoRef}
					autoPlay
					playsInline
					className="w-full h-full object-cover"
				/>
				{!stream && (
					<Button
						onClick={startCamera}
						className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
					>
						<Camera className="mr-2 h-4 w-4" />
						Start Camera
					</Button>
				)}
			</div>

			{stream && (
				<div className="flex justify-center gap-4 mt-4">
					<Button onClick={toggleCamera} variant="outline">
						<SwitchCamera className="h-4 w-4" />
					</Button>
					<Button onClick={capturePhoto}>
						<Camera className="mr-2 h-4 w-4" />
						Capture
					</Button>
				</div>
			)}
		</Card>
	);
};
