"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewStory() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const createNewStory = async () => {
    if (isCreating) return;

    try {
      setIsCreating(true);
      const response = await axios.post("/api/story/new");

      // Refresh the current route to update the stories list
      router.refresh();

      // Navigate to the newly created story
      router.push(`/story/${response.data.id}`);

      toast.success("New story created!");
    } catch (error) {
      toast.error(`Error: ${error}`);
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 mb-4">
      <button title="Add New Story" onClick={createNewStory} disabled={isCreating}>
        <Card
          className={`w-[150px] hover:border hover:border-blue-500 hover:cursor-pointer ${isCreating ? "opacity-50" : ""}`}
        >
          <CardContent className="flex justify-center items-center mx-auto">
            <Plus size={80} className={isCreating ? "animate-pulse" : ""} />
          </CardContent>
        </Card>
      </button>
      <footer className="text-center text-sm">{isCreating ? "Creating..." : "Add New Story"}</footer>
    </div>
  );
}
