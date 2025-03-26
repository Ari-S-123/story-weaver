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
      </div>
    </div>
  );
}
