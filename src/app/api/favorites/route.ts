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
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;
    // Get search parameter
    const search = url.searchParams.get("search") || "";

    if (!userId) {
      return new NextResponse("User Not Authenticated", { status: 401 });
    }

    // Get story IDs from user's favorites - using a direct query to ensure fresh data
    const favorites = await db.favorite.findMany({
      where: {
        userId
      },
      select: {
        storyId: true
      },
      orderBy: {
        createdAt: "desc" // Most recently favorited first
      }
    });

    const storyIds = favorites.map((fav) => fav.storyId);

    // If no favorites, return empty
    if (storyIds.length === 0) {
      return NextResponse.json(
        {
          stories: [],
          meta: {
            total: 0,
            page,
            limit,
            pageCount: 0
          }
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate",
            Pragma: "no-cache",
            Expires: "0"
          }
        }
      );
    }

    // Get favorited stories with pagination
    const whereClause: Prisma.StoryWhereInput = {
      id: {
        in: storyIds
      },
      ...(search
        ? {
            title: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode
            }
          }
        : {})
    };

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

    // Ensure the response has no-cache headers
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
    return new NextResponse("GET Error: Failed to fetch favorite stories.", { status: 500 });
  }
}
