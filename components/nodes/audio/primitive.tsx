import { transcribeAction } from '@/app/actions/generate/transcribe';
import { NodeLayout } from '@/components/nodes/layout';
import { Uploader } from '@/components/uploader';
import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';
import { useParams } from 'next/navigation';
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
  const { projectId } = useParams();

  const handleUploadCompleted = async (blob: PutBlobResult) => {
    const transcription = await transcribeAction(
      blob.downloadUrl,
      projectId as string
    );

    if ('error' in transcription) {
      throw new Error(transcription.error);
    }

    updateNodeData(id, { content: blob, transcript: transcription.transcript });
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
