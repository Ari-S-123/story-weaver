"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  // Format the error message for better readability
  const errorMessage =
    error.message && error.message.includes("Failed to parse URL")
      ? "Error: The application URL is misconfigured. Please check your environment variables."
      : error.message;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-rose-100 p-3 rounded-full">
            <AlertTriangleIcon className="size-10 text-rose-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Something went wrong...</h2>
          <p>{errorMessage}</p>
          {error.digest && <p className="text-xs text-gray-500">Error ID: {error.digest}</p>}
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <Button variant="outline" onClick={reset} className="font-medium px-6">
          Try again
        </Button>
        <Button asChild variant="ghost" className="font-medium">
          <Link href="/">Go back</Link>
        </Button>
      </div>
    </div>
  );
}
