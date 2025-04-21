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
import { cn } from '@/lib/utils';
import { useReactFlow } from '@xyflow/react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { type ComponentType, useState } from 'react';

type ModelSelectorProps = {
  id: string;
  value: string;
  options: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }[];
};

export const ModelSelector = ({ id, value, options }: ModelSelectorProps) => {
  const { updateNodeData } = useReactFlow();
  const [open, setOpen] = useState(false);
  const currentOption = options.find((option) => option.value === value);

  const handleChange = (value: string) => {
    updateNodeData(id, { model: value });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-[170px] justify-between rounded-full"
        >
          {currentOption ? (
            <div className="flex items-center gap-2">
              <currentOption.icon className="size-4" />
              {currentOption.label}
            </div>
          ) : (
            'Select model...'
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[170px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {options.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={() => {
                    handleChange(model.value);
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <model.icon className="size-4" />
                    {model.label}
                  </div>
                  <CheckIcon
                    className={cn(
                      'ml-auto size-4',
                      value === model.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
