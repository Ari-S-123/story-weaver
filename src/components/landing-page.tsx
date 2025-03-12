"use client";

import { Button } from "./ui/button";
import { toast } from "sonner";
export default function LandingPage() {
  // Center the whole div in the middle of the screen
  return (
    <div className="flex h-screen flex-col gap-4 items-center justify-center">
      <Button variant="outline" onClick={() => toast.success("Successfully logged in")}>
        Log In
      </Button>
      <Button variant="outline" onClick={() => toast.success("Successfully signed up")}>
        Sign Up
      </Button>
    </div>
  );
}
