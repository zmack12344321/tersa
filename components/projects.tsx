import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { projects } from '@/schema';
import { Panel } from '@xyflow/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

type ProjectsProps = {
  projects: (typeof projects.$inferSelect)[];
  currentProject: string;
};

export const Projects = ({ projects, currentProject }: ProjectsProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentProject);

  return (
    <Panel
      position="top-left"
      className="flex items-center rounded-full border bg-card/90 p-1 drop-shadow-xs backdrop-blur-sm"
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-expanded={open}
            className="w-[200px] justify-between rounded-full border-none shadow-none"
          >
            {value
              ? projects.find((project) => project.id === Number(value))?.name
              : 'Select project...'}
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search project..." className="h-9" />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup>
                {projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    value={project.id.toString()}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                    }}
                  >
                    {project.name}
                    <CheckIcon
                      className={cn(
                        'ml-auto',
                        value === project.id.toString()
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Panel>
  );
};
