import { useChat } from '@ai-sdk/react';
import { useReactFlow } from '@xyflow/react';
import { Loader2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { NodeLayout } from './layout';

type TransformNodeProps = {
  text?: string[];
  data: {
    text?: string[];
    updatedAt?: string;
  };
  id: string;
};

export const TransformNode = ({ data, id, text }: TransformNodeProps) => {
  const { updateNodeData } = useReactFlow();
  const { append, messages, setMessages, status, stop } = useChat({
    onError: (error) => toast.error(error.message),
    onFinish: () => {
      updateNodeData(id, {
        text: messages.map((message) => message.content),
        updatedAt: new Date().toISOString(),
      });
    },
  });

  const handleGenerate = () => {
    const text = data.text?.join('\n');

    if (!text) {
      return;
    }

    setMessages([]);
    append({
      role: 'user',
      content: text,
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

  if (status === 'streaming') {
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
  }

  return (
    <NodeLayout id={id} data={data} type="Transform" action={action}>
      <div className="p-4">
        {!nonUserMessages.length && status === 'streaming' && (
          <div className="flex items-center justify-center">
            <Loader2Icon size={16} className="animate-spin" />
          </div>
        )}
        {!nonUserMessages.length && status === 'ready' && (
          <div className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Press "Generate" to start
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
