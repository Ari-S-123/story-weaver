import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Check if user has liked a story
export async function GET(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user has already liked this story
    const existingLike = await db.like.findFirst({
      where: {
        storyId,
        userId
      }
    });

    return NextResponse.json(
      { isLiked: !!existingLike },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0"
        }
      }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("GET Error: Failed to check like status.", { status: 500 });
  }
}

// Add a like
export async function POST(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the story to check if it's public and if the user is not the owner
    const story = await db.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return new NextResponse("Story not found", { status: 404 });
    }

    // Only allow liking public stories
    if (story.visibility !== "public") {
      return new NextResponse("Cannot like private stories", { status: 403 });
    }

    // Users can't like their own stories
    if (story.ownerId === userId) {
      return new NextResponse("Cannot like your own story", { status: 403 });
    }

    // Check if user has already liked this story
    const existingLike = await db.like.findFirst({
      where: {
        storyId,
        userId
      }
    });

    if (existingLike) {
      return new NextResponse("Story already liked", { status: 400 });
    }

    // Create the like
    await db.like.create({
      data: {
        storyId,
        userId
      }
    });

    return new NextResponse("Story liked", { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("POST Error: Failed to like story.", { status: 500 });
  }
}

// Remove a like
export async function DELETE(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the like exists
    const existingLike = await db.like.findFirst({
      where: {
        storyId,
        userId
      }
    });

    if (!existingLike) {
      return new NextResponse("Story not liked", { status: 404 });
    }

    // Delete the like
    await db.like.delete({
      where: {
        id: existingLike.id
      }
    });

    return new NextResponse("Like removed", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("DELETE Error: Failed to remove like.", { status: 500 });
  }
}
