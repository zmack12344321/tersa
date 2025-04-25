import { generateSpeechAction } from '@/app/actions/generate/speech';
import { transcribeAction } from '@/app/actions/generate/transcribe';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { speechModels } from '@/lib/models';
import { getRecursiveIncomers, getTextFromTextNodes } from '@/lib/xyflow';
import { upload } from '@vercel/blob/client';
import { useReactFlow } from '@xyflow/react';
import { ClockIcon, Loader2Icon, PlayIcon } from 'lucide-react';
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
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
  const [audio, setAudio] = useState<string | null>(
    data.audio?.downloadUrl ?? null
  );
  const [loading, setLoading] = useState(false);
  const { projectId } = useParams();

  const handleGenerate = async () => {
    if (loading) {
      return;
    }

    const incomers = getRecursiveIncomers(id, getNodes(), getEdges());
    const textPrompts = getTextFromTextNodes(incomers);

    if (!textPrompts.length) {
      toast.error('No prompts found');
      return;
    }

    try {
      setLoading(true);
      const response = await generateSpeechAction(textPrompts);

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
        audio: newBlob,
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

  if (data.updatedAt) {
    toolbar.push({
      tooltip: `Last updated: ${new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(data.updatedAt))}`,
      children: (
        <Button size="icon" variant="ghost" className="rounded-full">
          <ClockIcon size={12} />
        </Button>
      ),
    });
  }

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
    </NodeLayout>
  );
};
