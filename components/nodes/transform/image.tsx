import { generateImageAction } from '@/app/actions/image';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useUser } from '@clerk/nextjs';
import { useReactFlow } from '@xyflow/react';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

type TransformImageNodeProps = {
  text?: string[];
  data: {
    text?: string[];
    type?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformImageNode = ({ data, id }: TransformImageNodeProps) => {
  const { updateNodeData } = useReactFlow();
  const [image, setImage] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleGenerate = async () => {
    const text = data.text?.join('\n');

    if (!text || loading) {
      return;
    }

    try {
      setLoading(true);
      const response = await generateImageAction(text);
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

  const action = user ? (
    <Button
      size="sm"
      variant="outline"
      onClick={handleGenerate}
      className="-my-2"
    >
      {image ? 'Regenerate' : 'Generate'}
    </Button>
  ) : (
    <Tooltip>
      <TooltipTrigger asChild>
        <div>
          <Button disabled size="sm" variant="outline" className="-my-2">
            {image ? 'Regenerate' : 'Generate'}
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
          <Select
            value={data.type}
            onValueChange={(value) => updateNodeData(id, { type: value })}
          >
            <SelectTrigger size="sm" className="bg-background">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="image">Image</SelectItem>
            </SelectContent>
          </Select>
          {action}
        </div>
      }
    >
      <div>
        {loading && !image && (
          <div className="flex items-center justify-center p-4">
            <Loader2Icon size={16} className="animate-spin" />
          </div>
        )}
        {!loading && !image && (
          <div className="flex items-center justify-center p-4">
            <p className="text-muted-foreground text-sm">
              Press "Generate" to start
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
