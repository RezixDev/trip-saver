// lib/export.ts
import { StorageItem } from "./storage";

export function exportToCSV(trips: StorageItem[]) {
  // Define CSV headers
  const headers = [
    "Title",
    "Date",
    "Description",
    "Location Address",
    "Latitude",
    "Longitude",
    "Created At"
  ];

  // Convert trips to CSV rows
  const rows = trips.map(trip => {
    const data = trip.data;
    return [
      `"${data.title}"`, // Quote to handle commas in titles
      data.date,
      `"${data.description}"`, // Quote to handle commas in descriptions
      `"${data.location?.address || ''}"`,
      data.location?.latitude || '',
      data.location?.longitude || '',
      new Date(trip.timestamp).toLocaleString()
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and return blob
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  return blob;
}