import { NodeLayout } from '@/components/nodes/layout';
import { Uploader } from '@/components/uploader';
import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';
import Image from 'next/image';

type ImagePrimitiveProps = {
  type: string;
  data: {
    content?: PutBlobResult;
    width?: number;
    height?: number;
  };
  id: string;
};

const getImageDimensions = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new window.Image();
    image.src = url;

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };

    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });

export const ImagePrimitive = ({ data, id, type }: ImagePrimitiveProps) => {
  const { updateNodeData } = useReactFlow();
  const handleUploadCompleted = async (blob: PutBlobResult) => {
    const response = await getImageDimensions(blob.downloadUrl);

    updateNodeData(id, {
      content: blob,
      width: response.width,
      height: response.height,
    });
  };

  return (
    <NodeLayout id={id} data={data} type={type} title="Image">
      {data.content ? (
        <Image
          src={data.content.downloadUrl}
          alt="Image"
          width={data.width ?? 1000}
          height={data.height ?? 1000}
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
