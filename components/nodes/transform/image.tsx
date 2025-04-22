import { generateImageAction } from '@/app/actions/generate/image';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { imageModels } from '@/lib/models';
import { useUser } from '@clerk/nextjs';
import { getIncomers, useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { type ComponentProps, useState } from 'react';
import { toast } from 'sonner';
import { ModelSelector } from './model-selector';
import { TypeSelector } from './type-selector';

type TransformImageNodeProps = {
  data: {
    text?: string[];
    type?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformImageNode = ({ data, id }: TransformImageNodeProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const [image, setImage] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

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
      const response = await generateImageAction(prompts.join('\n'));
      setImage(response);
      updateNodeData(id, {
        updatedAt: new Date().toISOString(),
        image: response,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const toolbar: ComponentProps<typeof NodeLayout>['toolbar'] = [
    {
      children: <TypeSelector id={id} type="image" key={`${id}-selector`} />,
    },
    {
      children: (
        <ModelSelector
          id={id}
          value={data.model ?? 'dall-e-3'}
          options={imageModels}
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
    <NodeLayout id={id} data={data} type="Transform" toolbar={toolbar}>
      <div>
        {loading && !image && (
          <div className="flex items-center justify-center p-4">
            <Loader2Icon size={16} className="animate-spin" />
          </div>
        )}
        {!loading && !image && (
          <div className="flex items-center justify-center p-4">
            <p className="text-muted-foreground text-sm">
              Press "Generate" to create an image
            </p>
          </div>
        )}
        {image && (
          <Image
            src={URL.createObjectURL(new Blob([image]))}
            alt="Generated image"
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
