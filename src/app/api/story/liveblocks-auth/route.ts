import { Liveblocks } from "@liveblocks/node";
import { db } from "@/utils/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { sessionClaims } = await auth();
  if (!sessionClaims) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { room } = await req.json();

  const story = await db.story.findUnique({
    where: {
      id: room
    }
  });

  if (!story) {
    return new NextResponse("Story not found", { status: 404 });
  }

  // Check user permissions
  const isOwner = story.ownerId === user.id;
  const isMember = !!(story.organizationId && story.organizationId === sessionClaims.org_id);
  const hasWriteAccess = isOwner || isMember;

  // For private stories, only allow collaborators to access
  if (story.visibility === "private" && !hasWriteAccess) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!
  });

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
      avatar: user.imageUrl
    }
  });

  // Grant appropriate permissions based on user's role
  if (hasWriteAccess) {
    // Full access for owners and organization members
    session.allow(room, session.FULL_ACCESS);
  } else {
    // Read-only access for others (public stories)
    session.allow(room, session.READ_ACCESS);
  }

  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
