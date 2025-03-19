"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useEditorStore from "@/store/use-editor-store";
import Underline from "@tiptap/extension-underline";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Trash, Save } from "lucide-react";
import { Story } from "@/lib/types/story";
import { useRouter } from "next/navigation";

type EditorProps = {
  story: Story;
};

export default function Editor({ story }: EditorProps) {
  const router = useRouter();
  async function onStoryDelete() {
    try {
      await axios.delete(`/api/story/${story.id}`);
      toast.success("Story deleted successfully.");
      router.push("/");
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  }

  async function onStoryUpdate() {
    try {
      await axios.put(`/api/story/${story.id}`, {
        title: "test",
        content: editor?.getText()
      });
      toast.success("Story updated successfully.");
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  }
  const { setEditor } = useEditorStore();
  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(undefined);
    },
    onUpdate({ editor }) {
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      setEditor(editor);
    },
    onTransaction({ editor }) {
      setEditor(editor);
    },
    onFocus({ editor }) {
      setEditor(editor);
    },
    onBlur({ editor }) {
      setEditor(editor);
    },
    onContentError({ editor }) {
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: "padding-left: 64px; padding-right: 64px;",
        class:
          "focus:outline-none print:border-0 bg-gray-100 flex flex-col min-h-[1024px] w-[768px] pt-10 pr-14 pb-10 cursor-text dark:bg-neutral-900 dark:text-white"
      }
    },
    immediatelyRender: false,
    extensions: [StarterKit, Underline],
    content: story.content
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex mx-4 justify-start items-center gap-2">
        <Button variant={"outline"} size={"icon"} onClick={onStoryUpdate}>
          <Save size={16} />
        </Button>
        <Button variant={"destructive"} size={"icon"} onClick={onStoryDelete}>
          <Trash size={16} />
        </Button>
      </div>
      <div className="size-full overflow-x-auto px-4 print:p-0 print:bg-white print:overflow-visible">
        <div className="min-w-max flex justify-center w-[768px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
