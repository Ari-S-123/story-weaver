import { auth } from "@clerk/nextjs/server";
import { db } from "@/utils/db";
import { redirect } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { BookText } from "lucide-react";
import Link from "next/link";
export default async function RecentStories() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }
  const userStories = await db.story.findMany({
    where: { userId: userId },
    orderBy: {
      updatedAt: "desc"
    }
  });

  const storyCards = userStories.map((story) => (
    <div key={story.id} className="flex flex-col gap-1">
      <Link href={`/story/${story.id}`}>
        <Card className="w-[150px] hover:border hover:border-blue-500 hover:cursor-pointer">
          <CardContent className="flex justify-center items-center mx-auto">
            <BookText size={80} />
          </CardContent>
        </Card>
      </Link>
      <footer className="text-center">{story.title}</footer>
      <footer className="text-center italic text-sm">
        Updated {Math.floor((Date.now() - new Date(story.updatedAt).getTime()) / (1000 * 60 * 60))} hours ago
      </footer>
    </div>
  ));

  return <div className="flex justify-start items-center gap-4">{storyCards}</div>;
}
