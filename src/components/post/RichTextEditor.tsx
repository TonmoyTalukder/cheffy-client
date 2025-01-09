"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}
const modules = {
  toolbar: [["bold", "italic", "underline"], [{ link: "link" }]],
};

const formats = ["bold", "italic", "underline", "link"];
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
}) as any;

const RichTextEditor: React.FC<RichTextEditorProps> = memo(
  ({ value, onChange }) => {
    return (
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={value}
        onChange={onChange}
        placeholder="Type here..."
      />
    );
  },
) as React.FC<RichTextEditorProps>;

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
