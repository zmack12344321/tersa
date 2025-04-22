import { transcribeAction } from '@/app/actions/generate/transcribe';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { speechModels } from '@/lib/models';
import { getIncomers, useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { ModelSelector } from '../model-selector';

type TranscribeNodeProps = {
  data: {
    model?: string;
    type?: string;
    updatedAt?: string;
    content?: object;
  };
  id: string;
};

export const TranscribeNode = ({ data, id }: TranscribeNodeProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const [text, setText] = useState<string | null>(null);
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
      const response = await transcribeAction(prompts.join('\n'));
      setText(response);
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
    <NodeLayout id={id} data={data} type="Transcribe" toolbar={toolbar}>
      <div>
        {loading && !text && (
          <div className="flex items-center justify-center p-4">
            <Loader2Icon size={16} className="animate-spin" />
          </div>
        )}
        {!loading && !text && (
          <div className="flex items-center justify-center p-4">
            <p className="text-muted-foreground text-sm">
              Press "Generate" to transcribe text
            </p>
          </div>
        )}
        {text && <ReactMarkdown>{text}</ReactMarkdown>}
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
