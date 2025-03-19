import { auth, currentUser } from "@clerk/nextjs/server";
import LandingPage from "./landing-page";
import NewStory from "./new-story";
import RecentStories from "./recent-stories";
import { Suspense } from "react";
import { Loader } from "lucide-react";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) return <LandingPage />;

  // 2 Components here: create new story button and list of recent stories
  return (
    <div className="m-4">
      <h2 className="text-2xl font-bold m-8">Welcome {user?.firstName}</h2>
      <div className="mx-8 flex justify-start items-center gap-4">
        <Suspense fallback={<Loader className="flex justify-center animate-spin"></Loader>}>
          <NewStory />
        </Suspense>
        <Suspense fallback={<Loader className="flex justify-center animate-spin"></Loader>}>
          <RecentStories />
        </Suspense>
      </div>
    </div>
  );
}
