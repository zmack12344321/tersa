import { describeAction } from '@/app/actions/generate/describe';
import { generateImageAction } from '@/app/actions/generate/image';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { imageModels } from '@/lib/models';
import { getRecursiveIncomers } from '@/lib/xyflow';
import type { PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import { useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { type ComponentProps, useState } from 'react';
import { toast } from 'sonner';
import type { ImageNodeProps } from '.';
import { ModelSelector } from '../model-selector';

type ImageTransformProps = ImageNodeProps & {
  title: string;
};

export const ImageTransform = ({
  data,
  id,
  type,
  title,
}: ImageTransformProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const [image, setImage] = useState<string | null>(
    (data.content as PutBlobResult)?.url ?? null
  );
  const [loading, setLoading] = useState(false);
  const { projectId } = useParams();

  const handleGenerate = async () => {
    if (loading) {
      return;
    }

    const incoming = getRecursiveIncomers(id, getNodes(), getEdges());
    const prompts: string[] = incoming
      .filter((incomer) => getNode(incomer.id)?.type === 'text')
      .map((incomer) => getNode(incomer.id)?.data.text)
      .filter(Boolean) as string[];
    const transcriptNodes: string[] = incoming
      .filter((incomer) => getNode(incomer.id)?.type === 'transcribe')
      .map(
        (incomer) =>
          getNode(incomer.id)?.data.content as
            | { transcript: string }
            | undefined
      )
      .map((node) => node?.transcript)
      .filter(Boolean) as string[];

    if (!prompts.length && !transcriptNodes.length) {
      toast.error('No prompts or transcripts found');
      return;
    }

    try {
      setLoading(true);

      const response = await generateImageAction(
        [...prompts, ...transcriptNodes].join('\n'),
        data.model ?? 'dall-e-3'
      );

      const newBlob = await upload(
        'generated-image.png',
        new Blob([response]),
        {
          access: 'public',
          handleUploadUrl: '/api/upload',
        }
      );

      setImage(newBlob.downloadUrl);

      const description = await describeAction(
        newBlob.downloadUrl,
        projectId as string
      );

      if ('error' in description) {
        throw new Error(description.error);
      }

      updateNodeData(id, {
        updatedAt: new Date().toISOString(),
        content: newBlob,
        description: description.description,
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
          value={data.model ?? 'dall-e-3'}
          options={imageModels}
          id={id}
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
            src={image}
            alt="Generated image"
            width={1600}
            height={900}
            className="aspect-video w-full rounded-t-lg object-cover"
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
