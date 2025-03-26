import Editor from "@/app/story/[storyId]/editor";
import { db } from "@/utils/db";
import { Story } from "@/lib/types/story";
import Room from "./room";
import { Suspense } from "react";
import { Loading } from "@/components/loading";

export default async function StoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params;
  const storyData = await db.story.findUnique({
    where: { id: storyId }
  });

  if (!storyData) {
    return <div>Story not found</div>;
  }

  // Convert null values to undefined to match the Story type
  const story: Story = {
    ...storyData,
    title: storyData.title || undefined,
    content: storyData.content || undefined
  };

  return (
    <div className="mt-6">
      <Suspense fallback={<Loading variant="embedded" text="Loading story..." />}>
        <Room>
          <Editor story={story} />
        </Room>
      </Suspense>
    </div>
  );
}
