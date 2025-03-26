import { db } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ storyId: string }> }) {
  try {
    const { storyId } = await params;

    // Count likes for this story
    const count = await db.like.count({
      where: {
        storyId
      }
    });

    return NextResponse.json(
      { count },
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
    return new NextResponse("GET Error: Failed to count likes.", { status: 500 });
  }
}
