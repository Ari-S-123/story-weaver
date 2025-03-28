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

    // Get all public stories
    const stories = await db.story.findMany({
      where: whereClause,
      select: {
        id: true,
        ownerId: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        organizationId: true,
        visibility: true
      },
      skip,
      take: limit
    });

    // Get likes count for each story
    const storyIds = stories.map((story) => story.id);

    // Get like counts for all stories
    const likeCounts = await db.like.groupBy({
      by: ["storyId"],
      where: {
        storyId: {
          in: storyIds
        }
      },
      _count: {
        id: true
      }
    });

    // Create a map of story ID to like count
    const likeCountMap = new Map();
    likeCounts.forEach((count) => {
      likeCountMap.set(count.storyId, count._count.id);
    });

    // Add like counts to stories
    const storiesWithLikes = stories.map((story) => ({
      ...story,
      likeCount: likeCountMap.get(story.id) || 0
    }));

    // Sort stories by like count in descending order
    storiesWithLikes.sort((a, b) => b.likeCount - a.likeCount);

    // Get total count for pagination
    const totalStories = await db.story.count({
      where: whereClause
    });

    return NextResponse.json(
      {
        stories: storiesWithLikes,
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
    return new NextResponse("GET Error: Failed to fetch public stories.", { status: 500 });
  }
}
