import { Panel } from '@xyflow/react';
import { ImageIcon, VideoIcon } from 'lucide-react';
import { TextIcon } from 'lucide-react';
import { Button } from './ui/button';

type ToolbarProps = {
  addNode: (type: string) => void;
};

export const Toolbar = ({ addNode }: ToolbarProps) => {
  const addButtons = [
    {
      icon: TextIcon,
      onClick: () => addNode('text'),
    },
    {
      icon: ImageIcon,
      onClick: () => addNode('image'),
    },
    {
      icon: VideoIcon,
      onClick: () => addNode('video'),
    },
  ];

  return (
    <Panel
      position="bottom-center"
      className="flex items-center gap-1 rounded-full border bg-background/90 p-1 drop-shadow-xs backdrop-blur-sm"
    >
      {addButtons.map((button) => (
        <Button
          key={button.icon.name}
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
