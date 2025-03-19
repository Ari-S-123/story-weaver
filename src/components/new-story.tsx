"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function NewStory() {
  const createNewStory = async () => {
    try {
      const response = await axios.post("/api/story/new");
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button title="Add New Story" onClick={createNewStory}>
        <Card className="w-[150px] hover:border hover:border-blue-500 hover:cursor-pointer">
          <CardContent className="flex justify-center items-center mx-auto">
            <Plus size={80} />
          </CardContent>
        </Card>
      </button>
      <footer className="text-center italic text-sm">Add New Story</footer>
    </div>
  );
}
