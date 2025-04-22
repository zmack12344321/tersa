import { generateSpeechAction } from '@/app/actions/generate/speech';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { speechModels } from '@/lib/models';
import { getIncomers, useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { toast } from 'sonner';
import { ModelSelector } from '../model-selector';

type GenerateSpeechNodeProps = {
  data: {
    model?: string;
    type?: string;
    updatedAt?: string;
    content?: object;
  };
  id: string;
};

export const GenerateSpeechNode = ({ data, id }: GenerateSpeechNodeProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const [audio, setAudio] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);

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
      setAudio(response);
      updateNodeData(id, {
        updatedAt: new Date().toISOString(),
        audio: response,
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
          id={id}
          value={data.model ?? 'tts-1'}
          options={speechModels}
          key={id}
        />
      ),
    },
    {
      tooltip: 'Generate',
      children: (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleGenerate}
          key={`${id}-generate`}
        >
          <PlayIcon size={12} />
        </Button>
      ),
    },
  ];

  return (
    <NodeLayout id={id} data={data} type="Generate Speech" toolbar={toolbar}>
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
            <audio src={URL.createObjectURL(new Blob([audio]))} controls />
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
