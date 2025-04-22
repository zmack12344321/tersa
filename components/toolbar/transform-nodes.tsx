import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Node, type XYPosition, useReactFlow } from '@xyflow/react';
import {
  BrainIcon,
  ImageIcon,
  MessageCircleIcon,
  MicIcon,
  TextIcon,
  VideoIcon,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '../ui/button';

export const TransformNodes = () => {
  const { addNodes } = useReactFlow();

  const addNode = (
    type: string,
    position?: XYPosition,
    data?: Record<string, unknown>
  ) => {
    const newNode: Node = {
      id: nanoid(),
      type,
      data: data ?? {},
      position: position ?? { x: 0, y: 0 },
      origin: [0, 0.5],
    };

    addNodes([newNode]);
  };

  const buttons = [
    {
      id: 'generateText',
      label: 'Generate Text',
      icon: TextIcon,
      onClick: () => addNode('generateText', undefined, { type: 'text' }),
    },
    {
      id: 'generateSpeech',
      label: 'Generate Speech',
      icon: MessageCircleIcon,
      onClick: () => addNode('generateSpeech', undefined, { type: 'speech' }),
    },
    {
      id: 'generateVideo',
      label: 'Generate Video',
      icon: VideoIcon,
      onClick: () => addNode('generateVideo', undefined, { type: 'video' }),
    },
    {
      id: 'generateImage',
      label: 'Generate Image',
      icon: ImageIcon,
      onClick: () => addNode('generateImage', undefined, { type: 'image' }),
    },
    {
      id: 'transcribe',
      label: 'Transcribe',
      icon: MicIcon,
      onClick: () => addNode('transcribe', undefined, { type: 'transcribe' }),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="cursor-pointer rounded-full"
        >
          <BrainIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {buttons.map((button) => (
          <DropdownMenuItem
            key={button.id}
            onClick={button.onClick}
            className="flex items-center gap-2"
          >
            <button.icon size={16} />
            <span>{button.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
