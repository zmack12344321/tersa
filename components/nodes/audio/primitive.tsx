import { NodeLayout } from '@/components/nodes/layout';
import { Uploader } from '@/components/uploader';
import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';

type AudioPrimitiveProps = {
  type: string;
  data: {
    content?: PutBlobResult;
  };
  id: string;
};

export const AudioPrimitive = ({ data, id, type }: AudioPrimitiveProps) => {
  const { updateNodeData } = useReactFlow();
  const handleUploadCompleted = (blob: PutBlobResult) => {
    updateNodeData(id, { content: blob });
  };

  return (
    <NodeLayout id={id} data={data} type={type} title="Audio">
      <div className="p-4">
        {data.content ? (
          // biome-ignore lint/a11y/useMediaCaption: <explanation>
          <audio src={data.content.downloadUrl} controls />
        ) : (
          <Uploader
            onUploadCompleted={handleUploadCompleted}
            accept={{
              'audio/*': [],
            }}
          />
        )}
      </div>
    </NodeLayout>
  );
};
