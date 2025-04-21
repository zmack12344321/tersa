import { Panel } from '@xyflow/react';
import type { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';

type ToolbarProps = {
  addNode: (type: string) => void;
  buttons: {
    id: string;
    icon: LucideIcon;
    onClick: () => void;
  }[];
};

export const Toolbar = ({ buttons }: ToolbarProps) => (
  <Panel
    position="bottom-center"
    className="flex items-center gap-1 rounded-full border bg-background/90 p-1 drop-shadow-xs backdrop-blur-sm"
  >
    {buttons.map((button) => (
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
