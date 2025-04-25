import type { PutBlobResult } from '@vercel/blob';
import { AudioPrimitive } from './primitive';
import { AudioTransform } from './transform';

type AudioNodeProps = {
  type: string;
  data: {
    source: 'primitive' | 'transform';
    content?: PutBlobResult;
    updatedAt?: string;
  };
  id: string;
};

export const AudioNode = ({ data, id, type }: AudioNodeProps) => {
  const Component =
    data.source === 'primitive' ? AudioPrimitive : AudioTransform;

  return <Component data={data} id={id} type={type} />;
};
