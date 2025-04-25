import type { PutBlobResult } from '@vercel/blob';
import { VideoPrimitive } from './primitive';
import { VideoTransform } from './transform';

type VideoNodeProps = {
  type: string;
  data: {
    source: 'primitive' | 'transform';
    content?: PutBlobResult;
    width?: number;
    height?: number;
    updatedAt?: string;
  };
  id: string;
};

export const VideoNode = ({ data, id, type }: VideoNodeProps) => {
  const Component =
    data.source === 'primitive' ? VideoPrimitive : VideoTransform;

  return <Component data={data} id={id} type={type} />;
};
