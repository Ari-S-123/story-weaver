import { auth } from "@clerk/nextjs/server";
import LandingPage from "./landing-page";
import RecentStories from "./recent-stories";
import Feed from "./feed";
import { Suspense } from "react";
import { Loading } from "./loading";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) return <LandingPage />;

  return (
    <div className="m-4">
      <h2 className="text-2xl font-bold m-8">Your Stories</h2>
      <div className="mx-8 flex justify-center items-center gap-4">
        <Suspense fallback={<Loading variant="embedded" text="Loading stories..." />}>
          <RecentStories />
        </Suspense>
      </div>
      <h2 className="text-2xl font-bold m-8">Your Feed</h2>
      <Feed />
    </div>
  );
}
