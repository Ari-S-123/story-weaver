import { create } from "zustand";
import { type Editor } from "@tiptap/react";

type EditorState = {
  editor: Editor | undefined;
  setEditor: (editor: Editor | undefined) => void;
};

const useEditorStore = create<EditorState>((set) => ({
  editor: undefined,
  setEditor: (editor) => set({ editor })
}));

export default useEditorStore;
