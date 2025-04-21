import { Button } from '@/components/ui/button';
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
import type { chatModels } from '@/lib/models';
import { cn } from '@/lib/utils';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

type ModelSelectorProps = {
  id: string;
  value: string;
  options: typeof chatModels;
};

export const ModelSelector = ({ id, value, options }: ModelSelectorProps) => {
  const { updateNodeData } = useReactFlow();
  const [open, setOpen] = useState(false);
  const currentOption = options
    .flatMap((option) => option.models)
    .find((model) => model.id === value);

  const handleChange = (value: string) => {
    updateNodeData(id, { model: value });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[200px] justify-between rounded-full"
        >
          {currentOption ? (
            <div className="flex items-center gap-2 overflow-hidden">
              <currentOption.icon className="size-4 shrink-0" />
              <span className="block truncate">{currentOption.label}</span>
            </div>
          ) : (
            'Select model...'
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            {options.map((option) => (
              <CommandGroup key={option.label} heading={option.label}>
                {option.models.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={model.id}
                    onSelect={() => {
                      handleChange(model.id);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <model.icon className="size-4 shrink-0" />
                      <span className="block truncate">{model.label}</span>
                    </div>
                    <CheckIcon
                      className={cn(
                        'ml-auto size-4',
                        value === model.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
