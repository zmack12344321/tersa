import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChat } from '@ai-sdk/react';
import { useReactFlow } from '@xyflow/react';
import { Loader2Icon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

type TransformNodeProps = {
  text?: string[];
  data: {
    text?: string[];
    type?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformTextNode = ({ data, id }: TransformNodeProps) => {
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
