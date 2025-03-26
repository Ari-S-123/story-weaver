import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import NavWrapper from "@/components/nav-wrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-tiptap/styles.css";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { neobrutalism } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "StoryWeaver",
  description: "The greatest place to write your next story."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: neobrutalism }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Toaster />
            <Suspense fallback={<Loading variant="embedded" text="Loading..." />}>
              <NuqsAdapter>
                <main>
                  <NavWrapper />
                  {children}
                  <Analytics />
                </main>
              </NuqsAdapter>
            </Suspense>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
