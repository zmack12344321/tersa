import { generateSpeechAction } from '@/app/actions/generate/speech';
import { transcribeAction } from '@/app/actions/generate/transcribe';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { speechModels } from '@/lib/models';
import { upload } from '@vercel/blob/client';
import { getIncomers, useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { type ComponentProps, useState } from 'react';
import { toast } from 'sonner';
import type { AudioNodeProps } from '.';
import { ModelSelector } from '../model-selector';

type AudioTransformProps = AudioNodeProps & {
  title: string;
};

export const AudioTransform = ({
  data,
  id,
  type,
  title,
}: AudioTransformProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const [audio, setAudio] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { projectId } = useParams();

  const handleGenerate = async () => {
    if (loading) {
      return;
    }

    const incomers = getIncomers({ id, type: 'text' }, getNodes(), getEdges());
    const prompts = incomers
      .map((incomer) => getNode(incomer.id)?.data.text)
      .filter(Boolean);

    if (!prompts.length) {
      toast.error('No prompts found');
      return;
    }

    try {
      setLoading(true);
      const response = await generateSpeechAction(prompts.join('\n'));

      const newBlob = await upload(
        'generated-audio.mp3',
        new Blob([response]),
        {
          access: 'public',
          handleUploadUrl: '/api/upload',
        }
      );

      setAudio(newBlob.downloadUrl);

      const transcription = await transcribeAction(
        newBlob.downloadUrl,
        projectId as string
      );

      if ('error' in transcription) {
        throw new Error(transcription.error);
      }

      updateNodeData(id, {
        updatedAt: new Date().toISOString(),
        audio: response,
        transcript: transcription.transcript,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const toolbar: ComponentProps<typeof NodeLayout>['toolbar'] = [
    {
      children: (
        <ModelSelector
          value={data.model ?? 'tts-1'}
          options={speechModels}
          key={id}
          className="w-[200px] rounded-full"
          onChange={(value) => updateNodeData(id, { model: value })}
        />
      ),
    },
    {
      tooltip: 'Generate',
      children: (
        <Button size="icon" className="rounded-full" onClick={handleGenerate}>
          <PlayIcon size={12} />
        </Button>
      ),
    },
  ];

  return (
    <NodeLayout id={id} data={data} type={type} title={title} toolbar={toolbar}>
      <div>
        {loading && !audio && (
          <div className="flex items-center justify-center p-4">
            <Loader2Icon size={16} className="animate-spin" />
          </div>
        )}
        {!loading && !audio && (
          <div className="flex items-center justify-center p-4">
            <p className="text-muted-foreground text-sm">
              Press "Generate" to synthesize speech
            </p>
          </div>
        )}
        {audio && (
          <div className="flex items-center justify-center p-4">
            {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
            <audio src={audio} controls />
          </div>
        )}
      </div>
      {data.updatedAt && (
        <div className="flex items-center justify-between p-4">
          <p className="text-muted-foreground text-sm">
            Last updated:{' '}
            {new Intl.DateTimeFormat('en-US', {
              dateStyle: 'short',
              timeStyle: 'short',
            }).format(new Date(data.updatedAt))}
          </p>
        </div>
      )}
    </NodeLayout>
  );
};
