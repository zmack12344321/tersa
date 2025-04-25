import { NodeLayout } from '@/components/nodes/layout';
import { Uploader } from '@/components/uploader';
import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';
import type { VideoNodeProps } from '.';

type VideoPrimitiveProps = VideoNodeProps & {
  title: string;
};

const getVideoDimensions = (url: string) =>
  new Promise<{ width: number; height: number }>((resolve, reject) => {
    const video = document.createElement('video');
    video.src = url;

    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth, height: video.videoHeight });
    };

    video.onerror = () => {
      reject(new Error('Failed to load video'));
    };
  });

export const VideoPrimitive = ({
  data,
  id,
  type,
  title,
}: VideoPrimitiveProps) => {
  const { updateNodeData } = useReactFlow();
  const handleUploadCompleted = async (blob: PutBlobResult) => {
    const response = await getVideoDimensions(blob.downloadUrl);

    updateNodeData(id, {
      content: blob,
      width: response.width,
      height: response.height,
    });
  };

  return (
    <NodeLayout id={id} data={data} type={type} title={title}>
      {data.content ? (
        <video
          src={data.content.downloadUrl}
          width={data.width ?? 100}
          height={data.height ?? 100}
          className="h-auto w-full rounded-lg"
          playsInline
          autoPlay
          muted
          loop
        />
      ) : (
        <div className="p-4">
          <Uploader
            onUploadCompleted={handleUploadCompleted}
            accept={{
              'video/*': [],
            }}
          />
        </div>
      )}
    </NodeLayout>
  );
};
