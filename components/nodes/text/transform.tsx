import { NodeLayout } from '@/components/nodes/layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { chatModels } from '@/lib/models';
import {
  getImageURLsFromImageNodes,
  getRecursiveIncomers,
  getTextFromTextNodes,
  getTranscriptionFromAudioNodes,
} from '@/lib/xyflow';
import { useChat } from '@ai-sdk/react';
import { useUser } from '@clerk/nextjs';
import { useReactFlow } from '@xyflow/react';
import {
  ClockIcon,
  Loader2Icon,
  PlayIcon,
  RotateCcwIcon,
  SquareIcon,
} from 'lucide-react';
import type { ChangeEventHandler, ComponentProps } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import type { TextNodeProps } from '.';
import { ModelSelector } from '../model-selector';

type TextTransformProps = TextNodeProps & {
  title: string;
};

export const TextTransform = ({
  data,
  id,
  type,
  title,
}: TextTransformProps) => {
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
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
    const textPrompts = getTextFromTextNodes(incoming);
    const audioPrompts = await getTranscriptionFromAudioNodes(incoming);
    const images = getImageURLsFromImageNodes(incoming);

    if (!textPrompts.length && !audioPrompts.length) {
      toast.error('No prompts found');
      return;
    }

    setMessages([]);
    append({
      role: 'user',
      content: [
        '--- Instructions ---',
        data.instructions ?? 'None.',
        '--- Text Prompts ---',
        ...textPrompts,
        '--- Audio Prompts ---',
        ...audioPrompts,
      ].join('\n'),
      experimental_attachments: images.map((image) => ({
        url: image,
      })),
    });
  };

  const handleInstructionsChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => updateNodeData(id, { instructions: event.target.value });

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

  if (data.updatedAt) {
    toolbar.push({
      tooltip: `Last updated: ${new Intl.DateTimeFormat('en-US', {
        dateStyle: 'short',
        timeStyle: 'short',
      }).format(new Date(data.updatedAt))}`,
      children: (
        <Button size="icon" className="rounded-full">
          <ClockIcon size={12} />
        </Button>
      ),
    });
  }
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
          <Button size="icon" className="rounded-full" onClick={handleGenerate}>
            <PlayIcon size={12} />
          </Button>
        ),
      });
    }
  }

  return (
    <NodeLayout id={id} data={data} title={title} type={type} toolbar={toolbar}>
      <div className="flex-1 p-4">
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
      <Textarea
        value={data.instructions ?? ''}
        onChange={handleInstructionsChange}
        placeholder="Enter instructions"
        className="shrink-0 rounded-none rounded-b-lg border-none bg-secondary/50 shadow-none focus-visible:ring-0"
      />
    </NodeLayout>
  );
};
