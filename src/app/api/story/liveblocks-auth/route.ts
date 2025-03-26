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
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const isOwner = story.ownerId === user.id;
  // TODO: Implement this properly with changes to the schema
  const canEdit = isOwner || true;
  if (!canEdit) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!
  });

  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name: user.fullName ?? "Anonymous",
      avatar: user.imageUrl
    }
  });

  session.allow(room, session.FULL_ACCESS);
  const { body, status } = await session.authorize();

  return new Response(body, { status });
}
