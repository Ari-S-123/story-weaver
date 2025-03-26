"use client";

import { Card, CardContent } from "./ui/card";
import { BookText, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import NewStory from "./new-story";
import { Suspense } from "react";
import { useSearchParam } from "@/hooks/use-search-param";
import { Loading } from "./loading";

type Story = {
  id: string;
  title: string;
  content: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  pageCount: number;
};

export default function RecentStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    pageCount: 0
  });
  const [search] = useSearchParam("search");

  // Fetch stories data with pagination
  const fetchStories = useCallback(
    async (page = 1, limit = 5) => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/story?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`
        );
        setStories(response.data.stories);
        setMeta(response.data.meta);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [search]
  );

  useEffect(() => {
    fetchStories(meta.page, meta.limit);

    // Set up an interval to refresh stories every minute
    const intervalId = setInterval(() => {
      fetchStories(meta.page, meta.limit);
    }, 60000);

    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [meta.page, meta.limit, search, fetchStories]);

  const goToPage = (page: number) => {
    if (page < 1 || page > meta.pageCount) return;
    fetchStories(page, meta.limit);
  };

  const renderPagination = () => {
    if (meta.pageCount <= 1) return null;

    return (
      <div className="flex items-center justify-center gap-2 mt-4">
        <Button variant="outline" size="icon" onClick={() => goToPage(meta.page - 1)} disabled={meta.page === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {meta.page} of {meta.pageCount}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => goToPage(meta.page + 1)}
          disabled={meta.page === meta.pageCount}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (isLoading && stories.length === 0) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-start items-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex flex-col gap-1">
              <Card className="w-[150px] h-[100px] bg-gray-200 dark:bg-gray-700">
                <CardContent className="flex justify-center items-center mx-auto"></CardContent>
              </Card>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stories.length === 0 && !search) {
    return <div className="text-sm">No stories yet. Create your first one!</div>;
  } else if (stories.length === 0) {
    return <div className="text-sm">No stories found with this search term. Create it now!</div>;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap justify-start items-center gap-4">
        <Suspense fallback={<Loading variant="embedded" text="Loading new story..." />}>
          <NewStory />
        </Suspense>
        {stories.map((story) => (
          <div key={story.id} className="flex flex-col gap-1 mb-4">
            <Link href={`/story/${story.id}`}>
              <Card className="w-[150px] hover:border hover:border-blue-500 hover:cursor-pointer">
                <CardContent className="flex justify-center items-center mx-auto">
                  <BookText size={80} />
                </CardContent>
              </Card>
            </Link>
            <footer className="text-center truncate w-[150px]" title={story.title}>
              {story.title}
            </footer>
          </div>
        ))}
      </div>
      {renderPagination()}
    </div>
  );
}
