"use client";

import {
  BoldIcon,
  ItalicIcon,
  LucideIcon,
  PrinterIcon,
  Redo2Icon,
  Trash,
  UnderlineIcon,
  Undo2Icon
} from "lucide-react";
import ToolbarButton from "./toolbar-button";
import useEditorStore from "@/store/use-editor-store";

type ToolbarSection = {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  onClick: () => void;
};

export default function Toolbar() {
  const { editor } = useEditorStore();
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
      }
    ]
  ];
  return (
    <div className="bg-gray-100 dark:bg-neutral-900 m-4 px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
      {sections[0].map((item) => (
        <ToolbarButton key={item.label} {...item} />
      ))}
      {/*
      TODO: Font family and size
      */}
    </div>
  );
}
