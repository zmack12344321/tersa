import type { JSONContent } from '@tiptap/core';
import { TextPrimitive } from './primitive';
import { TextTransform } from './transform';

export type TextNodeProps = {
  type: string;
  data: {
    source: 'primitive' | 'transform';
    content?: JSONContent;
    model?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TextNode = ({ data, id, type }: TextNodeProps) => {
  const Component = data.source === 'primitive' ? TextPrimitive : TextTransform;

  return <Component data={data} id={id} type={type} title="Text" />;
};
