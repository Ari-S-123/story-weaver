import { Button } from "./ui/button";
import { SignInButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <h1 className="text-4xl font-bold">
        Welcome to <strong>StoryWeaver</strong>
      </h1>
      <p>The greatest place to write your next story.</p>
      <SignInButton>
        <Button variant="outline">Get Started 🪡</Button>
      </SignInButton>
    </div>
  );
}
