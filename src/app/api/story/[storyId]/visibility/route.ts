import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }

    const { visibility } = await request.json();

    // Validate visibility value
    if (visibility !== "public" && visibility !== "private") {
      return new NextResponse("Invalid visibility value. Must be 'public' or 'private'.", { status: 400 });
    }

    // Fetch the story to check ownership
    const story = await db.story.findUnique({
      where: { id: storyId },
      select: { ownerId: true }
    });

    if (!story) {
      return new NextResponse("Story not found", { status: 404 });
    }

    // Only the owner can change visibility
    if (story.ownerId !== userId) {
      return new NextResponse("Unauthorized: Only the owner can change story visibility", { status: 403 });
    }

    // Update the story visibility
    await db.story.update({
      where: { id: storyId },
      data: { visibility }
    });

    revalidatePath("/");
    return new NextResponse("Successfully updated story visibility.", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("PATCH Error: Failed to update story visibility.", { status: 500 });
  }
}
