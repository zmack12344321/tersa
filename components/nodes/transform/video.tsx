import { generateVideoAction } from '@/app/actions/video';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { getIncomers, useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { type ComponentProps, useState } from 'react';
import { toast } from 'sonner';
import { TypeSelector } from './type-selector';

type TransformVideoNodeProps = {
  text?: string[];
  data: {
    text?: string[];
    type?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformVideoNode = ({ data, id }: TransformVideoNodeProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const [video, setVideo] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
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
      const response = await generateVideoAction(prompts.join('\n'));
      setVideo(response);
      updateNodeData(id, {
        updatedAt: new Date().toISOString(),
        video: response,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const toolbar: ComponentProps<typeof NodeLayout>['toolbar'] = [
    {
      children: <TypeSelector id={id} type="video" key={`${id}-selector`} />,
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
    <NodeLayout id={id} data={data} type="Transform" toolbar={toolbar}>
      <div>
        {loading && !video && (
          <div className="flex items-center justify-center p-4">
            <Loader2Icon size={16} className="animate-spin" />
          </div>
        )}
        {!loading && !video && (
          <div className="flex items-center justify-center p-4">
            <p className="text-muted-foreground text-sm">
              Press "Generate" to create a video
            </p>
          </div>
        )}
        {video && (
          // biome-ignore lint/a11y/useMediaCaption: <explanation>
          <video
            src={URL.createObjectURL(new Blob([video]))}
            width={1600}
            height={900}
            className="aspect-video w-full object-cover"
          />
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
