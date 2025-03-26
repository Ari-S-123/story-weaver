import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Check if user has favorited a story
export async function GET(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user has already favorited this story
    const existingFavorite = await db.favorite.findFirst({
      where: {
        storyId,
        userId
      }
    });

    return NextResponse.json(
      { isFavorited: !!existingFavorite },
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
    return new NextResponse("GET Error: Failed to check favorite status.", { status: 500 });
  }
}

// Add a favorite
export async function POST(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId, orgId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get the story to check if it's public
    const story = await db.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return new NextResponse("Story not found", { status: 404 });
    }

    // Check if user has access to the story:
    // 1. Story is public - anyone can favorite
    // 2. User is the owner - can favorite their own story regardless of visibility
    // 3. User is part of the organization - can favorite if story belongs to their org
    const hasAccess =
      story.visibility === "public" ||
      story.ownerId === userId ||
      (story.organizationId && story.organizationId === orgId);

    if (!hasAccess) {
      return new NextResponse("Cannot favorite stories you don't have access to", { status: 403 });
    }

    // Check if user has already favorited this story
    const existingFavorite = await db.favorite.findFirst({
      where: {
        storyId,
        userId
      }
    });

    if (existingFavorite) {
      return new NextResponse("Story already favorited", { status: 400 });
    }

    // Create the favorite
    await db.favorite.create({
      data: {
        storyId,
        userId
      }
    });

    return new NextResponse("Story favorited", { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse("POST Error: Failed to favorite story.", { status: 500 });
  }
}

// Remove a favorite
export async function DELETE(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if the favorite exists
    const existingFavorite = await db.favorite.findFirst({
      where: {
        storyId,
        userId
      }
    });

    if (!existingFavorite) {
      return new NextResponse("Story not favorited", { status: 404 });
    }

    // Delete the favorite
    await db.favorite.delete({
      where: {
        id: existingFavorite.id
      }
    });

    return new NextResponse("Favorite removed", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("DELETE Error: Failed to remove favorite.", { status: 500 });
  }
}
