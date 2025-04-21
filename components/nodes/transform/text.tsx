import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useChat } from '@ai-sdk/react';
import { useUser } from '@clerk/nextjs';
import { getIncomers, useReactFlow } from '@xyflow/react';
import { Loader2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { TransformSelector } from './selector';

type TransformNodeProps = {
  text?: string[];
  data: {
    type?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformTextNode = ({ data, id }: TransformNodeProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const { append, messages, setMessages, status, stop } = useChat({
    onError: (error) => toast.error(error.message),
    onFinish: () => {
      updateNodeData(id, {
        text: messages.map((message) => message.content),
        updatedAt: new Date().toISOString(),
      });
    },
  });
  const { user } = useUser();

  const handleGenerate = () => {
    const incomers = getIncomers({ id, type: 'text' }, getNodes(), getEdges());
    const prompts = incomers
      .map((incomer) => getNode(incomer.id)?.data.text)
      .filter(Boolean);

    if (!prompts.length) {
      toast.error('No prompts found');
      return;
    }

    setMessages([]);
    append({
      role: 'user',
      content: prompts.join('\n'),
    });
  };

  const nonUserMessages = messages.filter((message) => message.role !== 'user');

  let action = (
    <Button
      size="sm"
      variant="outline"
      onClick={handleGenerate}
      className="-my-2"
    >
      Generate
    </Button>
  );

  if (!user) {
    action = (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button disabled size="sm" variant="outline" className="-my-2">
              Generate
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Login to generate</p>
        </TooltipContent>
      </Tooltip>
    );
  } else if (status === 'streaming') {
    action = (
      <Button
        size="sm"
        variant="outline"
        onClick={() => stop()}
        className="-my-2"
      >
        Stop
      </Button>
    );
  } else if (status === 'submitted') {
    action = (
      <Button size="sm" variant="outline" className="-my-2">
        Regenerate
      </Button>
    );
  }

  return (
    <NodeLayout
      id={id}
      data={data}
      type="Transform"
      action={
        <div className="flex items-center gap-2">
          <TransformSelector id={id} type="text" />
          {action}
        </div>
      }
    >
      <div className="p-4">
        {!nonUserMessages.length && status === 'streaming' && (
          <div className="flex items-center justify-center">
            <Loader2Icon size={16} className="animate-spin" />
          </div>
        )}
        {!nonUserMessages.length && status === 'ready' && (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Press "Generate" to generate text
            </p>
          </div>
        )}
        {nonUserMessages.map((message, index) => (
          <ReactMarkdown key={index}>{message.content}</ReactMarkdown>
        ))}
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
