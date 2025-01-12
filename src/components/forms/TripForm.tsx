// components/forms/TripForm.tsx
"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { storage } from "@/lib/storage"; // Make sure this import is correct
import { useRouter } from "next/navigation";

const formSchema = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters" })
		.max(50, { message: "Title must not exceed 50 characters" }),
	date: z.string({
		required_error: "Please select a date",
	}),
	description: z
		.string()
		.min(10, { message: "Description must be at least 10 characters" })
		.max(500, { message: "Description must not exceed 500 characters" }),
	location: z
		.object({
			latitude: z.number().optional(),
			longitude: z.number().optional(),
			address: z.string().optional(),
		})
		.optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function TripForm() {
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			date: new Date().toISOString().split("T")[0],
			description: "",
			location: {
				latitude: undefined,
				longitude: undefined,
				address: "",
			},
		},
	});

	async function onSubmit(data: FormValues) {
		try {
			setIsLoading(true);

			// Save to storage
			await storage.saveItem({
				type: "form",
				data: data,
			});

			toast({
				title: "Success",
				description: "Trip created successfully",
			});

			// Reset form and redirect to trips page
			form.reset();
			router.push("/trips");
			router.refresh(); // This will refresh the trips list
		} catch (error) {
			console.error("Error saving trip:", error);
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input placeholder="Enter trip title" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date</FormLabel>
							<FormControl>
								<Input type="date" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Enter trip description"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Creating..." : "Create Trip"}
				</Button>
			</form>
		</Form>
	);
}
