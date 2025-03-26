import Editor from "@/app/story/[storyId]/editor";
import { Story } from "@/lib/types/story";
import Room from "./room";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { auth } from "@clerk/nextjs/server";
import LandingPage from "@/components/landing-page";
import { notFound } from "next/navigation";
import { db } from "@/utils/db";

export default async function StoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = await params;
  const { userId, orgId } = await auth();

  if (!userId) return <LandingPage />;

  // Fetch the story directly from the database
  const storyData = await db.story.findUnique({
    where: { id: storyId }
  });

  // Handle not found
  if (!storyData) {
    notFound();
  }

  // Check permissions and determine write access
  let hasWriteAccess = false;

  // Owner has write access
  if (storyData.ownerId === userId) {
    hasWriteAccess = true;
  }

  // Organization members have write access if the story belongs to their organization
  if (storyData.organizationId && storyData.organizationId === orgId) {
    hasWriteAccess = true;
  }

  // For private stories, check if user has read access
  if (storyData.visibility === "private" && !hasWriteAccess) {
    throw new Error("You don't have permission to view this story");
  }

  // Convert null values to undefined to match the Story type
  // Ensure visibility is typed correctly
  const story: Story = {
    ...storyData,
    title: storyData.title || undefined,
    content: storyData.content || undefined,
    organizationId: storyData.organizationId || undefined,
    visibility: storyData.visibility as "public" | "private"
  };

  return (
    <div className="mt-6">
      <Suspense fallback={<Loading variant="embedded" text="Loading story..." />}>
        <Room>
          <Editor story={story} initialHasWriteAccess={hasWriteAccess} />
        </Room>
      </Suspense>
    </div>
  );
}
