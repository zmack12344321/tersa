import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';
import { Uploader } from '../uploader';
import { NodeLayout } from './layout';

type AudioNodeProps = {
  data: {
    content?: PutBlobResult;
  };
  id: string;
};

export const AudioNode = ({ data, id }: AudioNodeProps) => {
  const { updateNodeData } = useReactFlow();
  const handleUploadCompleted = (blob: PutBlobResult) => {
    updateNodeData(id, { content: blob });
  };

  return (
    <NodeLayout id={id} data={data} type="Audio">
      {data.content ? (
        // biome-ignore lint/a11y/useMediaCaption: <explanation>
        <audio src={data.content.downloadUrl} controls />
      ) : (
        <div className="p-4">
          <Uploader
            onUploadCompleted={handleUploadCompleted}
            accept={{
              'audio/*': [],
            }}
          />
        </div>
      )}
    </NodeLayout>
  );
};
