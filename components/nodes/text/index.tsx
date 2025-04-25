import type { JSONContent } from '@tiptap/core';
import { TextPrimitive } from './primitive';
import { TextTransform } from './transform';

type TextNodeProps = {
  type: string;
  data: {
    source: 'primitive' | 'transform';
    content?: JSONContent;
  };
  id: string;
};

export const TextNode = ({ data, id, type }: TextNodeProps) => {
  const Component = data.source === 'primitive' ? TextPrimitive : TextTransform;

  return <Component data={data} id={id} type={type} />;
};
