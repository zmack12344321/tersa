import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';
import { Uploader } from '../uploader';
import { NodeLayout } from './layout';

type VideoNodeProps = {
  data: {
    content?: PutBlobResult;
  };
  id: string;
};

export const VideoNode = ({ data, id }: VideoNodeProps) => {
  const { updateNodeData } = useReactFlow();
  const handleUploadCompleted = (blob: PutBlobResult) => {
    updateNodeData(id, { content: blob });
  };

  return (
    <NodeLayout id={id} data={data} type="Video">
      {data.content ? (
        // biome-ignore lint/a11y/useMediaCaption: <explanation>
        <video
          src={data.content.downloadUrl}
          width={100}
          height={100}
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
