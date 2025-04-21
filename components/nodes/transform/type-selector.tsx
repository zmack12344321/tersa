import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReactFlow } from '@xyflow/react';

type TypeSelectorProps = {
  id: string;
  type: string;
};

export const TypeSelector = ({ id, type }: TypeSelectorProps) => {
  const { updateNodeData } = useReactFlow();

  const handleChange = (value: string) => {
    updateNodeData(id, { type: value });
  };

  return (
    <Select value={type} onValueChange={handleChange}>
      <SelectTrigger size="sm" className="ml-1 rounded-full">
        <SelectValue placeholder="Select a type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="text">Text</SelectItem>
        <SelectItem value="image">Image</SelectItem>
        <SelectItem value="video">Video</SelectItem>
        <SelectItem value="speech">Speech</SelectItem>
      </SelectContent>
    </Select>
  );
};
