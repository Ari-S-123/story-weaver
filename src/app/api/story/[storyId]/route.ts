import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId, orgId } = await auth();

    // Fetch the story
    const story = await db.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return new NextResponse("Story not found", { status: 404 });
    }

    // Check access permissions
    // 1. Public stories are accessible to everyone
    if (story.visibility === "public") {
      return NextResponse.json(story, { status: 200 });
    }

    // 2. Private stories are only accessible to the owner or organization members
    if (story.visibility === "private") {
      // Not authenticated users cannot access private stories
      if (!userId) {
        return new NextResponse("Unauthorized: Private story access denied", { status: 403 });
      }

      // Check if user is the owner
      if (story.ownerId === userId) {
        return NextResponse.json(story, { status: 200 });
      }

      // Check if user belongs to the story's organization
      if (story.organizationId && story.organizationId === orgId) {
        return NextResponse.json(story, { status: 200 });
      }

      // User doesn't have access to this private story
      return new NextResponse("Unauthorized: Private story access denied", { status: 403 });
    }

    // Fallback case - shouldn't normally reach here
    return new NextResponse("Invalid story visibility setting", { status: 400 });
  } catch (error) {
    console.error(error);
    return new NextResponse("GET Error: Failed to fetch story details.", { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }

    const { title, content } = await request.json();

    // Fetch the story first to check if it belongs to an organization
    const story = await db.story.findUnique({
      where: { id: storyId },
      select: { organizationId: true, ownerId: true }
    });

    if (!story) {
      return new NextResponse("Story not found", { status: 404 });
    }

    // Prepare where clause - if story has an organizationId, only check storyId
    // otherwise check both storyId and ownerId (original behavior)
    const whereClause = story.organizationId ? { id: storyId } : { id: storyId, ownerId: userId };

    await db.story.update({
      where: whereClause,
      data: {
        title,
        content
      }
    });

    revalidatePath("/");
    return new NextResponse("Successfully updated story.", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("PUT Error: Failed to update story.", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }

    await db.story.delete({
      where: {
        id: storyId,
        ownerId: userId
      }
    });

    revalidatePath("/");
    return new NextResponse("Successfully deleted story.", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("DELETE Error: Failed to delete story.", { status: 500 });
  }
}
