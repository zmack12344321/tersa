import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Panel, type XYPosition } from '@xyflow/react';
import type { LucideIcon } from 'lucide-react';

type DropConnectProps = {
  position: XYPosition | null;
  buttons: {
    id: string;
    label: string;
    icon: LucideIcon;
    onClick: () => void;
  }[];
};

export const DropConnect = ({ position, buttons }: DropConnectProps) => {
  return (
    <Panel
      className={cn('absolute w-sm border shadow-sm', !position && 'hidden')}
      style={{
        left: position?.x,
        top: position?.y,
      }}
    >
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Add node">
            {buttons.map((button) => (
              <CommandItem key={button.id} onClick={button.onClick}>
                <button.icon size={16} />
                {button.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </Panel>
  );
};
