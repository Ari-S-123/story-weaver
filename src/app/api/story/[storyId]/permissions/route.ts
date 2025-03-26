import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ hasWriteAccess: false }, { status: 200 });
    }

    // Fetch the story
    const story = await db.story.findUnique({
      where: { id: storyId }
    });

    if (!story) {
      return new NextResponse("Story not found", { status: 404 });
    }

    // Determine write access
    let hasWriteAccess = false;

    // Owner has write access
    if (story.ownerId === userId) {
      hasWriteAccess = true;
    }

    // Organization members have write access if the story belongs to their organization
    if (story.organizationId && story.organizationId === orgId) {
      hasWriteAccess = true;
    }

    return NextResponse.json({ hasWriteAccess }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to check permissions", { status: 500 });
  }
}
