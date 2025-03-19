"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useEditorStore from "@/store/use-editor-store";
import Underline from "@tiptap/extension-underline";

export default function Editor() {
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
          "focus:outline-none print:border-0 bg-gray-100 flex flex-col min-h-[1024px] w-[768px] pt-10 pr-14 pb-10 cursor-text dark:bg-black dark:text-white"
      }
    },
    immediatelyRender: false,
    extensions: [StarterKit, Underline],
    content: "<p>Hello World</p>"
  });
  return (
    <div className="size-full overflow-x-auto px-4 print:p-0 print:bg-white print:overflow-visible">
      <div className="min-w-max flex justify-center w-[768px] py-4 print:py-0 mx-auto print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
