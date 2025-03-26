import { Button } from "@/components/ui/button";
import { FileQuestionIcon } from "lucide-react";
import Link from "next/link";

export default function StoryNotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-amber-100 p-3 rounded-full">
            <FileQuestionIcon className="size-10 text-amber-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Story not found</h2>
          <p>The story you are looking for does not exist or has been deleted.</p>
        </div>
      </div>
      <Button asChild variant="default" className="font-medium">
        <Link href="/">Return to Home</Link>
      </Button>
    </div>
  );
}
