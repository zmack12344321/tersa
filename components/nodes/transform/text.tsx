import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { chatModels } from '@/lib/models';
import { useChat } from '@ai-sdk/react';
import { useUser } from '@clerk/nextjs';
import { getIncomers, useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon, RotateCcwIcon, SquareIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { ModelSelector } from './model-selector';
import { TypeSelector } from './type-selector';

type TransformNodeProps = {
  text?: string[];
  data: {
    model?: string;
    type?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformTextNode = ({ data, id }: TransformNodeProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const { append, messages, setMessages, status, stop } = useChat({
    body: {
      modelId: data.model,
    },
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

  const toolbar: ComponentProps<typeof NodeLayout>['toolbar'] = [
    {
      children: <TypeSelector id={id} type="text" key={id} />,
    },
    {
      children: (
        <ModelSelector
          id={id}
          value={data.model ?? 'gpt-4'}
          options={chatModels}
          key={id}
        />
      ),
    },
  ];

  if (user) {
    if (status === 'streaming') {
      toolbar.push({
        tooltip: 'Stop',
        children: (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={stop}
          >
            <SquareIcon size={12} />
          </Button>
        ),
      });
    } else if (status === 'submitted') {
      toolbar.push({
        tooltip: 'Regenerate',
        children: (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleGenerate}
          >
            <RotateCcwIcon size={12} />
          </Button>
        ),
      });
    } else {
      toolbar.push({
        tooltip: 'Generate',
        children: (
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleGenerate}
          >
            <PlayIcon size={12} />
          </Button>
        ),
      });
    }
  }

  return (
    <NodeLayout id={id} data={data} type="Transform" toolbar={toolbar}>
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
