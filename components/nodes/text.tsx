import { EditorProvider } from '@/components/ui/kibo-ui/editor';
import type { Editor, JSONContent } from '@tiptap/core';
import { Handle, Position } from '@xyflow/react';
import { type ChangeEvent, useCallback, useState } from 'react';

type TextNodeData = {
  content?: JSONContent;
};

export const TextNode = ({ data }: { data: TextNodeData }) => {
  const [content, setContent] = useState<JSONContent>(data.content ?? []);

  const handleUpdate = ({ editor }: { editor: Editor }) => {
    const json = editor.getJSON();

    setContent(json);
  };

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="rounded-md border bg-card p-4">
        <EditorProvider
          content={content}
          placeholder="Start typing..."
          className="prose size-full"
          onUpdate={handleUpdate}
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};
