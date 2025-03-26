"use client";

import {
  BoldIcon,
  ItalicIcon,
  LucideIcon,
  MessageSquarePlusIcon,
  PrinterIcon,
  Redo2Icon,
  Trash,
  UnderlineIcon,
  Undo2Icon
} from "lucide-react";
import ToolbarButton from "./toolbar-button";
import useEditorStore from "@/store/use-editor-store";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";

type ToolbarSection = {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick: () => void;
};

type ToolbarProps = {
  ownerId: string;
};

export default function Toolbar({ ownerId }: ToolbarProps) {
  const { editor } = useEditorStore();
  const params = useParams();
  const router = useRouter();
  const storyId = params.storyId as string;
  const { userId } = useAuth();

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  async function onStoryDelete() {
    try {
      await axios.delete(`/api/story/${storyId}`);
      toast.success("Story deleted successfully.");
      router.push("/");
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  }

  const openDeleteAlert = () => {
    setShowDeleteAlert(true);
  };

  const sections: ToolbarSection[][] = [
    [
      {
        label: "Undo",
        icon: Undo2Icon,
        onClick: () => editor?.chain().focus().undo().run()
      },
      {
        label: "Redo",
        icon: Redo2Icon,
        onClick: () => editor?.chain().focus().redo().run()
      },
      {
        label: "Print",
        icon: PrinterIcon,
        onClick: () => window.print()
      },
      {
        label: "Bold",
        icon: BoldIcon,
        onClick: () => editor?.chain().focus().toggleBold().run()
      },
      {
        label: "Italic",
        icon: ItalicIcon,
        onClick: () => editor?.chain().focus().toggleItalic().run()
      },
      {
        label: "Underline",
        icon: UnderlineIcon,
        onClick: () => editor?.chain().focus().toggleUnderline().run()
      },
      {
        label: "Comment",
        icon: MessageSquarePlusIcon,
        onClick: () => editor?.chain().focus().addPendingComment().run(),
        isActive: editor?.isActive("liveblocksCommentMark")
      }
    ]
  ];

  const alertDialog = (
    <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteAlert(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onStoryDelete}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return (
    <div>
      {alertDialog}
      <div className="bg-gray-100 dark:bg-neutral-900 m-4 px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-x-0.5">
          {sections[0].map((item) => (
            <ToolbarButton key={item.label} {...item} />
          ))}
        </div>
        {ownerId === userId && (
          <div className="flex items-center">
            <ToolbarButton icon={Trash} onClick={openDeleteAlert} label="Delete Story" variant="destructive" />
          </div>
        )}
        {/*
      TODO: Font family and size
      */}
      </div>
    </div>
  );
}
