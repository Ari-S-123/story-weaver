import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type DeleteStoryParams = {
  storyId: string;
};

export async function DELETE(req: Request, { params }: { params: DeleteStoryParams }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }

    const deleteStory = await db.story.delete({
      where: {
        id: storyId,
        userId: userId
      }
    });
    revalidatePath("/");
    return new NextResponse("Successfully deleted story.", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("DELETE Error: Failed to delete story.", { status: 500 });
  }
}
