import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import SearchInput from "./search-input";
import { Home } from "lucide-react";
import Link from "next/link";
export default function NavBar() {
  return (
    <div className="flex justify-between m-4">
      <Link href="/" className="text-4xl font-bold">
        🪡StoryWeaver
      </Link>
      <SearchInput />
      <div className="flex justify-around items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/">
            <Home />
          </Link>
        </Button>
        <ModeToggle />
        <SignedOut>
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}
