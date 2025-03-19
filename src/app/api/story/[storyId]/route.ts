import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type UpdateStoryParams = {
  storyId: string;
};

type UpdateStoryBody = {
  title: string;
  content: string;
};

type DeleteStoryParams = {
  storyId: string;
};

export async function PUT(req: Request, { params }: { params: UpdateStoryParams }) {
  try {
    const { storyId } = await params;
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }

    const { title, content } = (await req.json()) as UpdateStoryBody;

    const story = await db.story.update({
      where: {
        id: storyId,
        userId: userId
      },
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
