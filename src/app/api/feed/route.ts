import { db } from "@/utils/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Parse pagination parameters from query
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    // Get search parameter
    const search = url.searchParams.get("search") || "";

    // Only fetch public stories
    const whereClause: Prisma.StoryWhereInput = {
      visibility: "public",
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode
            }
          }
        : {})
    };

    // Get public stories with pagination
    const stories = await db.story.findMany({
      where: whereClause,
      orderBy: {
        updatedAt: "desc"
      },
      skip,
      take: limit
    });

    // Get total count for pagination
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
    return new NextResponse("GET Error: Failed to fetch public stories.", { status: 500 });
  }
}
