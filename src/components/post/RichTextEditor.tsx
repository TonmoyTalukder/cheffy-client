"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
}
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
}) as any;

const RichTextEditor: React.FC<RichTextEditorProps> = memo(
  ({ value, onChange }) => {
    return <ReactQuill theme="snow" value={value} onChange={onChange} />;
  },
) as React.FC<RichTextEditorProps>;

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
