import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Node, type XYPosition, useReactFlow } from '@xyflow/react';
import {
  AudioWaveformIcon,
  ImageIcon,
  PlusIcon,
  TextIcon,
  VideoIcon,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '../ui/button';

export const PrimitiveNodes = () => {
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
      id: 'text',
      label: 'Text',
      icon: TextIcon,
      onClick: () => addNode('text'),
    },
    {
      id: 'image',
      label: 'Image',
      icon: ImageIcon,
      onClick: () => addNode('image'),
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: AudioWaveformIcon,
      onClick: () => addNode('audio'),
    },
    {
      id: 'video',
      label: 'Video',
      icon: VideoIcon,
      onClick: () => addNode('video'),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="cursor-pointer rounded-full"
        >
          <PlusIcon size={16} />
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
