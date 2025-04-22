import { transcribeAction } from '@/app/actions/generate/transcribe';
import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { chatModels } from '@/lib/models';
import { getRecursiveIncomers } from '@/lib/xyflow';
import { useChat } from '@ai-sdk/react';
import { useUser } from '@clerk/nextjs';
import type { PutBlobResult } from '@vercel/blob';
import { useReactFlow } from '@xyflow/react';
import { Loader2Icon, PlayIcon, RotateCcwIcon, SquareIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { ModelSelector } from '../model-selector';

type GenerateTextNodeProps = {
  text?: string[];
  data: {
    model?: string;
    type?: string;
    updatedAt?: string;
    content?: object;
  };
  id: string;
};

export const GenerateTextNode = ({ data, id }: GenerateTextNodeProps) => {
  const { updateNodeData, getNodes, getEdges, getNode } = useReactFlow();
  const { append, messages, setMessages, status, stop } = useChat({
    body: {
      modelId: data.model ?? 'gpt-4',
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

  const handleGenerate = async () => {
    const incoming = getRecursiveIncomers(id, getNodes(), getEdges());
    const prompts = incoming
      .filter((incomer) => getNode(incomer.id)?.type === 'text')
      .map((incomer) => getNode(incomer.id)?.data.text)
      .filter(Boolean);
    const audioNodes = incoming
      .filter((incomer) => getNode(incomer.id)?.type === 'audio')
      .map(
        (incomer) =>
          getNode(incomer.id)?.data.content as PutBlobResult | undefined
      )
      .filter(Boolean);

    if (!prompts.length && !audioNodes.length) {
      toast.error('No prompts or audio found');
      return;
    }

    const transcriptions: string[] = [];

    if (audioNodes.length) {
      for (const audioNode of audioNodes) {
        if (!audioNode) {
          continue;
        }

        const transcript = await transcribeAction(audioNode.downloadUrl);

        transcriptions.push(transcript);
      }
    }

    setMessages([]);
    append({
      role: 'user',
      content: [...prompts, ...transcriptions].join('\n'),
    });
  };

  const nonUserMessages = messages.filter((message) => message.role !== 'user');
  const toolbar: ComponentProps<typeof NodeLayout>['toolbar'] = [
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
    <NodeLayout id={id} data={data} type="Generate Text" toolbar={toolbar}>
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
