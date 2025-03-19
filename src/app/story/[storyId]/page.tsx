import Editor from "@/components/editor";
import { db } from "@/utils/db";
import Toolbar from "@/components/toolbar";

type StoryPageProps = {
  params: {
    storyId: string;
  };
};

export default async function StoryPage({ params }: StoryPageProps) {
  const { storyId } = await params;
  const story = await db.story.findUnique({
    where: { id: storyId }
  });

  // TODO: Make title editable, implement PUT request
  return (
    <div className="mt-6">
      <h3 className="text-center text-2xl font-bold">{story?.title}</h3>
      <Toolbar storyId={storyId} />
      <Editor />
    </div>
  );
}
