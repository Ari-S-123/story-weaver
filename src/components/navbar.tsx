"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import SearchInput from "./search-input";
import { Home } from "lucide-react";
import Link from "next/link";
import NewStory from "./new-story";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function NavBar() {
  const router = useRouter();
  const { organization } = useOrganization();
  const prevOrgIdRef = useRef<string | null>(null);

  // When organization changes, refresh the page
  useEffect(() => {
    if (!organization && !prevOrgIdRef.current) {
      // Initial load, just set the ref
      prevOrgIdRef.current = null;
      return;
    }

    const currentOrgId = organization?.id || null;

    // Only refresh if the organization has actually changed
    if (prevOrgIdRef.current !== currentOrgId) {
      prevOrgIdRef.current = currentOrgId;
      localStorage.setItem("orgSwitched", "true");
      router.refresh();
    }
  }, [organization, router]);

  // Clear the flag once used
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("orgSwitched")) {
      localStorage.removeItem("orgSwitched");
    }
  }, []);

  return (
    <div className="flex justify-between m-4">
      <Link href="/" className="text-4xl font-bold">
        🪡StoryWeaver
      </Link>
      <SearchInput />
      <div className="flex justify-around items-center gap-4">
        <NewStory />
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
          <div className="flex items-center gap-3">
            <OrganizationSwitcher
              appearance={{
                elements: {
                  organizationSwitcherTrigger: "text-neutral-500 font-medium",
                  organizationPreviewTextContainer: "text-neutral-500",
                  organizationSwitcherTriggerIcon: "text-neutral-500"
                }
              }}
              afterCreateOrganizationUrl="/"
              afterLeaveOrganizationUrl="/"
              afterSelectOrganizationUrl="/"
              afterSelectPersonalUrl="/"
            />
            <UserButton />
          </div>
        </SignedIn>
        <Button asChild variant="outline" size="icon">
          <Link href="https://github.com/Ari-S-123/story-weaver" target="_blank" rel="noopener noreferrer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-github"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </Link>
        </Button>
      </div>
    </div>
  );
}
