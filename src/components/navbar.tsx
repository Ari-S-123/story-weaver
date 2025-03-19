import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <div className="flex justify-between m-4">
      <h1 className="text-4xl font-bold">🪡StoryWeaver</h1>
      <div className="flex justify-around items-center gap-4">
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <ModeToggle />
      </div>
    </div>
  );
}
