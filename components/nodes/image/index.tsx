import type { JSONContent } from '@tiptap/core';
import { ImagePrimitive } from './primitive';
import { ImageTransform } from './transform';

type ImageNodeProps = {
  type: string;
  data: {
    source: 'primitive' | 'transform';
    content?: JSONContent;
  };
  id: string;
};

export const ImageNode = ({ data, id, type }: ImageNodeProps) => {
  const Component =
    data.source === 'primitive' ? ImagePrimitive : ImageTransform;

  return <Component data={data} id={id} type={type} />;
};
