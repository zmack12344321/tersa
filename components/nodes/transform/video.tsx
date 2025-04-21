import { generateVideoAction } from '@/app/actions/video';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUser } from '@clerk/nextjs';
import { useReactFlow } from '@xyflow/react';
import { Loader2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { TransformSelector } from './selector';

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
  const { updateNodeData } = useReactFlow();
  const [video, setVideo] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleGenerate = async () => {
    const text = data.text?.join('\n');

    if (!text || loading) {
      return;
    }

    try {
      setLoading(true);
      const response = await generateVideoAction(text);
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

  const action = user ? (
    <Button
      size="sm"
      variant="outline"
      onClick={handleGenerate}
      className="-my-2"
    >
      {video ? 'Regenerate' : 'Generate'}
    </Button>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Button disabled size="sm" variant="outline" className="-my-2">
            {video ? 'Regenerate' : 'Generate'}
          </Button>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Login to generate</p>
      </TooltipContent>
    </Tooltip>
  );

  return (
    <NodeLayout
      id={id}
      data={data}
      type="Transform"
      action={
        <div className="flex items-center gap-2">
          <TransformSelector id={id} type="video" />
          {action}
        </div>
      }
    >
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
          <video
            src={URL.createObjectURL(new Blob([video]))}
            alt="Generated video"
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
