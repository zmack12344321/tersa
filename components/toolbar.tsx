import { Panel } from '@xyflow/react';
import { BrainIcon, ImageIcon, VideoIcon } from 'lucide-react';
import { TextIcon } from 'lucide-react';
import { Button } from './ui/button';

type ToolbarProps = {
  addNode: (type: string) => void;
};

export const Toolbar = ({ addNode }: ToolbarProps) => {
  const addButtons = [
    {
      id: 'text',
      icon: TextIcon,
      onClick: () => addNode('text'),
    },
    {
      id: 'image',
      icon: ImageIcon,
      onClick: () => addNode('image'),
    },
    {
      id: 'video',
      icon: VideoIcon,
      onClick: () => addNode('video'),
    },
    {
      id: 'transform',
      icon: BrainIcon,
      onClick: () => addNode('transform'),
    },
  ];

  return (
    <Panel
      position="bottom-center"
      className="flex items-center gap-1 rounded-full border bg-background/90 p-1 drop-shadow-xs backdrop-blur-sm"
    >
      {addButtons.map((button) => (
        <Button
          key={button.id}
          onClick={button.onClick}
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <button.icon size={16} />
        </Button>
      ))}
    </Panel>
  );
};
