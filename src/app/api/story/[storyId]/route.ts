import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

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
