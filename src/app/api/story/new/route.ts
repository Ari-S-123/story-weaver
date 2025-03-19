import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/utils/db";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("The user is not authenticated.", { status: 401 });
    }
    const createNewStory = await db.story.create({
      data: {
        userId: userId,
        title: "Untitled Story",
        content: ""
      }
    });
    revalidatePath("/");
    return NextResponse.json(createNewStory, { status: 200 });
  } catch (error) {
    return new NextResponse("POST Error: Failed to create new story.", { status: 500 });
  }
}
