"use client";

import { Card, CardContent } from "./ui/card";
import { BookText, Heart, Star, User, Building } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { Story } from "@/lib/types/story";
import { useAuth, useUser, useOrganization } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type StoryCardProps = {
  story: Story;
  refreshData?: () => void; // Optional callback to refresh parent component data
};

export default function StoryCard({ story, refreshData }: StoryCardProps) {
  const { userId, orgId } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [ownerName, setOwnerName] = useState<string>("Unknown");
  const [refreshKey, setRefreshKey] = useState(0); // Add key for forcing re-renders
  const isOwner = story.ownerId === userId;
  const isOrgMember = Boolean(story.organizationId && story.organizationId === orgId);

  // Check if user has access to favorite this story
  const canFavorite = story.visibility === "public" || isOwner || isOrgMember;

  // Determine owner name based on available information
  useEffect(() => {
    if (isOwner && user) {
      const name = user.fullName || user.username || "Me";
      setOwnerName(name);
    } else if (isOrgMember && organization && story.organizationId === organization.id) {
      setOwnerName(organization.name || "Organization");
    } else if (story.organizationId) {
      setOwnerName("Organization");
    } else {
      setOwnerName("User");
    }
  }, [isOwner, isOrgMember, user, organization, story.organizationId]);

  // Fetch like and favorite status on mount and when refreshKey changes
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const [likeResponse, favoriteResponse, likesCountResponse] = await Promise.all([
          axios.get(`/api/story/${story.id}/like?t=${timestamp}`),
          axios.get(`/api/story/${story.id}/favorite?t=${timestamp}`),
          axios.get(`/api/story/${story.id}/likes-count?t=${timestamp}`)
        ]);

        setIsLiked(likeResponse.data.isLiked);
        setIsFavorited(favoriteResponse.data.isFavorited);
        setLikeCount(likesCountResponse.data.count);
      } catch (error) {
        console.error("Failed to fetch like/favorite status:", error);
      }
    };

    fetchStatus();
  }, [story.id, refreshKey]);

  const handleLike = async () => {
    if (isOwner) return; // Owners can't like their own stories

    try {
      if (isLiked) {
        await axios.delete(`/api/story/${story.id}/like`);
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        await axios.post(`/api/story/${story.id}/like`);
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }

      // Force this component to refresh itself
      setRefreshKey((prev) => prev + 1);

      // Add a small delay to ensure database operations complete
      // before triggering the parent refresh
      setTimeout(() => {
        if (refreshData) {
          refreshData();
        }
      }, 300);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        await axios.delete(`/api/story/${story.id}/favorite`);
        setIsFavorited(false);
      } else {
        await axios.post(`/api/story/${story.id}/favorite`);
        setIsFavorited(true);
      }

      // Force this component to refresh itself
      setRefreshKey((prev) => prev + 1);

      // Add a small delay to ensure database operations complete
      // before triggering the parent refresh
      setTimeout(() => {
        if (refreshData) {
          refreshData();
        }

        // Force a global refresh by using localStorage as a broadcast channel
        // This helps update all instances of this story across components
        const timestamp = new Date().getTime();
        localStorage.setItem("story-update", `${story.id}-${timestamp}`);

        // Dispatch custom event to notify other components in the same window
        window.dispatchEvent(new CustomEvent("localStorageUpdated"));
      }, 300);
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  // Listen for updates to this story from other StoryCard instances
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "story-update") {
        const [updatedStoryId] = (e.newValue || "").split("-");
        if (updatedStoryId === story.id) {
          // Force refresh of this component when the same story is updated elsewhere
          setRefreshKey((prev) => prev + 1);
        }
      }
    };

    // Use window event for same-tab communication
    const handleLocalUpdate = () => {
      const value = localStorage.getItem("story-update");
      if (value) {
        const [updatedStoryId] = value.split("-");
        if (updatedStoryId === story.id) {
          setRefreshKey((prev) => prev + 1);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageUpdated", handleLocalUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdated", handleLocalUpdate);
    };
  }, [story.id]);

  return (
    <div className="flex flex-col gap-1 mb-4">
      <Link href={`/story/${story.id}`}>
        <Card className="w-[150px] hover:border hover:border-blue-500 hover:cursor-pointer">
          <CardContent className="flex justify-center items-center mx-auto">
            <BookText size={80} />
          </CardContent>
        </Card>
      </Link>
      <div className="flex justify-center items-center w-[150px]">
        <span className="truncate text-sm text-center" title={story.title}>
          {story.title}
        </span>
      </div>

      <div className="flex justify-center items-center w-[150px]">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          {story.organizationId ? <Building className="h-3 w-3" /> : <User className="h-3 w-3" />}
          <span className="truncate max-w-[120px]" title={ownerName}>
            {ownerName}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center w-[150px]">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-6"
          onClick={handleLike}
          disabled={isOwner || story.visibility !== "public"}
        >
          <Heart className={cn("h-4 w-4 mr-1", isLiked ? "fill-red-500 text-red-500" : "text-gray-500")} />
          <span className="text-xs">{likeCount}</span>
        </Button>

        <Button variant="ghost" size="sm" className="p-0 h-6" onClick={handleFavorite} disabled={!canFavorite}>
          <Star className={cn("h-4 w-4", isFavorited ? "fill-yellow-500 text-yellow-500" : "text-gray-500")} />
        </Button>
      </div>
    </div>
  );
}
