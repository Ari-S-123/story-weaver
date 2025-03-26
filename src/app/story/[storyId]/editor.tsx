"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useEditorStore from "@/store/use-editor-store";
import Underline from "@tiptap/extension-underline";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../../../components/ui/input";
import { Story } from "@/lib/types/story";
import { useCallback, useEffect, useRef, useState } from "react";
import Toolbar from "../../../components/toolbar";
import { useLiveblocksExtension } from "@liveblocks/react-tiptap";
import Threads from "@/app/story/[storyId]/threads";
type EditorProps = {
  story: Story;
};

/**
 * TimeAgo component to display relative time
 * @param date - The date to display
 * @param className - The class name to apply to the span
 * @returns A span element with the relative time
 */
const TimeAgo = ({ date, className }: { date: Date; className?: string }) => {
  const timeAgo = getTimeAgo(date);
  return <span className={className}>Updated {timeAgo}</span>;
};

/**
 * Get the relative time
 * @param date - The date to display
 * @returns The relative time
 */
const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000); // years
  if (interval >= 1) {
    return interval === 1 ? "1 year ago" : `${interval} years ago`;
  }

  interval = Math.floor(seconds / 2592000); // months
  if (interval >= 1) {
    return interval === 1 ? "1 month ago" : `${interval} months ago`;
  }

  interval = Math.floor(seconds / 86400); // days
  if (interval >= 1) {
    return interval === 1 ? "1 day ago" : `${interval} days ago`;
  }

  interval = Math.floor(seconds / 3600); // hours
  if (interval >= 1) {
    return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
  }

  interval = Math.floor(seconds / 60); // minutes
  if (interval >= 1) {
    return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
  }

  return seconds <= 5 ? "just now" : `${seconds} seconds ago`;
};

export default function Editor({ story }: EditorProps) {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [title, setTitle] = useState(story.title || "");
  const [lastSavedAt, setLastSavedAt] = useState<Date>(new Date(story.updatedAt || Date.now()));
  const timeAgoUpdateRef = useRef<NodeJS.Timeout | null>(null);
  const [timeAgoKey, setTimeAgoKey] = useState(0);
  const [initialContent, setInitialContent] = useState(story.content || "");
  const [, setHasContentChanged] = useState(false);
  const initialLoadRef = useRef(true);
  const liveblocks = useLiveblocksExtension({
    initialContent: story.content
  });

  const saveContent = useCallback(
    async (content: string, newTitle?: string) => {
      try {
        await axios.put(`/api/story/${story.id}`, {
          title: newTitle || title,
          content: content
        });
        const now = new Date();
        setLastSavedAt(now);
        setTimeAgoKey((prev) => prev + 1); // Force TimeAgo to update
        toast.success("Story saved automatically");
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    },
    [story.id, title]
  );

  const debouncedSave = useCallback(
    (content: string, newTitle?: string) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveContent(content, newTitle);
      }, 1000); // Save after 1 second of inactivity
    },
    [saveContent]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (editor && newTitle !== story.title) {
      debouncedSave(editor.getText(), newTitle);
    }
  };

  // Update TimeAgo component periodically to keep the relative time fresh
  useEffect(() => {
    timeAgoUpdateRef.current = setInterval(() => {
      setTimeAgoKey((prev) => prev + 1);
    }, 60000); // Update every minute

    return () => {
      if (timeAgoUpdateRef.current) {
        clearInterval(timeAgoUpdateRef.current);
      }
    };
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const { setEditor } = useEditorStore();
  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
      setInitialContent(editor.getText());
    },
    onDestroy() {
      setEditor(undefined);
    },
    onUpdate({ editor }) {
      setEditor(editor);
      const currentContent = editor.getText();

      // Only save if it's not the initial load and content has actually changed
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        return;
      }

      if (currentContent !== initialContent) {
        setHasContentChanged(true);
        debouncedSave(currentContent);
      }
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
    extensions: [liveblocks, StarterKit.configure({ history: false }), Underline]
  });
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col mx-4 gap-4 justify-center items-center">
        <Toolbar />
        <Input
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-bold h-12 text-center max-w-2xl"
          placeholder="Enter story title"
        />
        <TimeAgo key={timeAgoKey} date={lastSavedAt} className="text-center text-sm italic" />
      </div>
      <div className="size-full overflow-x-auto px-4 print:p-0 print:bg-white print:overflow-visible">
        <div className="min-w-max flex justify-center w-[768px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
          <EditorContent editor={editor} />
          <Threads editor={editor} />
        </div>
      </div>
    </div>
  );
}
