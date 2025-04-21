import { useChat } from '@ai-sdk/react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Loader2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { Button } from '../ui/button';

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

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="shrink-0 grow-0 divide-y">
        {process.env.NODE_ENV === 'development' && (
          <p className="rounded-t-lg bg-secondary px-4 py-3 font-mono text-muted-foreground text-xs">
            {id}
          </p>
        )}
        <div className="p-4">
          {!nonUserMessages.length && status === 'streaming' && (
            <div className="flex items-center justify-center">
              <Loader2Icon size={16} className="animate-spin" />
            </div>
          )}
          {nonUserMessages.map((message, index) => (
            <ReactMarkdown key={index}>{message.content}</ReactMarkdown>
          ))}
        </div>
        <div className="flex items-center justify-between p-4">
          {data.updatedAt && (
            <p className="text-muted-foreground text-sm">
              Last updated:{' '}
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'short',
                timeStyle: 'short',
              }).format(new Date(data.updatedAt))}
            </p>
          )}
          {status === 'streaming' && (
            <Button variant="outline" onClick={() => stop()}>
              Stop
            </Button>
          )}
          {(status === 'ready' || status === 'error') && (
            <Button variant="outline" onClick={handleGenerate}>
              Generate
            </Button>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
