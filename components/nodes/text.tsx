import { EditorProvider } from '@/components/ui/kibo-ui/editor';
import { cn } from '@/lib/utils';
import type { Editor, JSONContent } from '@tiptap/core';
import { useReactFlow } from '@xyflow/react';
import { useState } from 'react';
import { NodeLayout } from './layout';

type TextNodeProps = {
  data: {
    content?: JSONContent;
  };
  id: string;
};

export const TextNode = ({ data, id }: TextNodeProps) => {
  const { updateNodeData } = useReactFlow();
  const [content, setContent] = useState<JSONContent | undefined>(
    data.content ?? undefined
  );
  const [words, setWords] = useState<number>(0);

  const handleUpdate = ({ editor }: { editor: Editor }) => {
    const json = editor.getJSON();
    const text = editor.getText();
    const newWords = editor.storage.characterCount.words();

    setContent(json);
    setWords(newWords);
    updateNodeData(id, { content: json, text });
  };

  return (
    <NodeLayout id={id} data={data} type="Text" caption={`${words} words`}>
      <div className="p-4">
        <EditorProvider
          autofocus
          immediatelyRender={false}
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
    </NodeLayout>
  );
};
