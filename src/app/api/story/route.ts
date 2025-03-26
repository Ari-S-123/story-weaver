import { db } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const url = new URL(req.url);

    // Parse pagination parameters from query
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const skip = (page - 1) * limit;
    // Get search parameter
    const search = url.searchParams.get("search") || "";

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }

    // Build the where clause with search condition
    const whereClause: Prisma.StoryWhereInput = {
      userId: userId,
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode
            }
          }
        : {})
    };

    // Get stories with pagination and search
    const stories = await db.story.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: "desc"
      },
      skip,
      take: limit
    });

    // Get total count for pagination with search filter
    const totalStories = await db.story.count({
      where: whereClause
    });

    return NextResponse.json(
      {
        stories,
        meta: {
          total: totalStories,
          page,
          limit,
          pageCount: Math.ceil(totalStories / limit)
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse("GET Error: Failed to fetch stories.", { status: 500 });
  }
}
