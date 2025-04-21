import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import { useUser } from '@clerk/nextjs';
import { SiOpenai } from '@icons-pack/react-simple-icons';
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

const models = [
  {
    icon: SiOpenai,
    label: 'GPT-3.5 Turbo',
    value: 'gpt-3.5-turbo',
  },
  {
    icon: SiOpenai,
    label: 'GPT-4',
    value: 'gpt-4',
  },
  {
    icon: SiOpenai,
    label: 'GPT-4.1',
    value: 'gpt-4.1',
  },
  {
    icon: SiOpenai,
    label: 'GPT-4.1 Mini',
    value: 'gpt-4.1-mini',
  },
  {
    icon: SiOpenai,
    label: 'GPT-4.1 Nano',
    value: 'gpt-4.1-nano',
  },
  {
    icon: SiOpenai,
    label: 'GPT-4o',
    value: 'gpt-4o',
  },
  {
    icon: SiOpenai,
    label: 'GPT-4o Mini',
    value: 'gpt-4o-mini',
  },
  {
    icon: SiOpenai,
    label: 'o1',
    value: 'o1',
  },
  {
    icon: SiOpenai,
    label: 'o1-mini',
    value: 'o1-mini',
  },
  {
    icon: SiOpenai,
    label: 'o3',
    value: 'o3',
  },
  {
    icon: SiOpenai,
    label: 'o3-mini',
    value: 'o3-mini',
  },
  {
    icon: SiOpenai,
    label: 'o4-mini',
    value: 'o4-mini',
  },
];

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

  const toolbar: ComponentProps<typeof NodeLayout>['toolbar'] = [
    {
      children: <TypeSelector id={id} type="text" key={id} />,
    },
    {
      children: (
        <ModelSelector
          id={id}
          value={data.model ?? 'gpt-4'}
          options={models}
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
