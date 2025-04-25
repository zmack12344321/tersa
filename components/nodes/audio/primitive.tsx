import { NodeLayout } from '@/components/nodes/layout';
import { Uploader } from '@/components/uploader';
import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';
import type { AudioNodeProps } from '.';

type AudioPrimitiveProps = AudioNodeProps & {
  title: string;
};

export const AudioPrimitive = ({
  data,
  id,
  type,
  title,
}: AudioPrimitiveProps) => {
  const { updateNodeData } = useReactFlow();
  const handleUploadCompleted = (blob: PutBlobResult) => {
    updateNodeData(id, { content: blob });
  };

  return (
    <NodeLayout id={id} data={data} type={type} title={title}>
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
