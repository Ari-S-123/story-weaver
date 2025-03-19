import { Button } from "./ui/button";
import { SignInButton } from "@clerk/nextjs";

// TODO: Make this look better
export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to StoryWeaver</h1>
      <p>The greatest place to write your next story.</p>
      <SignInButton>
        <Button variant="outline">Get Started</Button>
      </SignInButton>
    </div>
  );
}
