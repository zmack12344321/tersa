import { EditorProvider } from '@/components/ui/kibo-ui/editor';
import { cn } from '@/lib/utils';
import type { Editor, JSONContent } from '@tiptap/core';
import { Handle, Position } from '@xyflow/react';
import { type ChangeEvent, useCallback, useState } from 'react';

type TextNodeProps = {
  data: {
    content?: JSONContent;
  };
  id: string;
};

export const TextNode = ({ data, id }: TextNodeProps) => {
  const [content, setContent] = useState<JSONContent | undefined>(
    data.content ?? undefined
  );
  const [words, setWords] = useState<number>(0);

  const handleUpdate = ({ editor }: { editor: Editor }) => {
    const json = editor.getJSON();
    const newWords = editor.storage.characterCount.words();

    setContent(json);
    setWords(newWords);
  };

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="divide-y">
        {process.env.NODE_ENV === 'development' && (
          <div className="p-4">
            <code className="text-muted-foreground text-xs">{id}</code>
          </div>
        )}
        <div className="p-4">
          <EditorProvider
            content={content}
            placeholder="Start typing..."
            className={cn(
              'prose dark:prose-invert size-full',
              '[&_p:first-child]:mt-0',
              '[&_p:last-child]:mb-0'
            )}
            onUpdate={handleUpdate}
          />
        </div>
        <div className="p-4">{words}</div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
