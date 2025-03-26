"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

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
    <Button title="Add New Story" onClick={createNewStory} disabled={isCreating} variant="outline" size="icon">
      <Plus className={isCreating ? "animate-pulse" : ""} />
    </Button>
  );
}
