import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';
import Image from 'next/image';
import { Uploader } from '../uploader';
import { NodeLayout } from './layout';

type ImageNodeProps = {
  data: {
    content?: PutBlobResult;
  };
  id: string;
};

export const ImageNode = ({ data, id }: ImageNodeProps) => {
  const { updateNodeData } = useReactFlow();
  const handleUploadCompleted = (blob: PutBlobResult) => {
    updateNodeData(id, { content: blob });
  };

  return (
    <NodeLayout id={id} data={data} type="Image">
      {data.content ? (
        <Image
          src={data.content.downloadUrl}
          alt="Image"
          width={1000}
          height={1000}
          className="h-auto w-full rounded-lg"
        />
      ) : (
        <div className="p-4">
          <Uploader
            onUploadCompleted={handleUploadCompleted}
            accept={{
              'image/*': [],
            }}
          />
        </div>
      )}
    </NodeLayout>
  );
};
