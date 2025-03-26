"use client";

import { usePathname } from "next/navigation";
import NavBar from "./navbar";
import { useAuth } from "@clerk/nextjs";

export default function NavWrapper() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const isLandingPage = pathname === "/" || pathname === "/landing";

  // Always show navbar if user is signed in or if not on landing page
  if (isLandingPage && !isSignedIn) {
    return null;
  }

  return <NavBar />;
}
