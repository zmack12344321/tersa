import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useReactFlow } from '@xyflow/react';
import {
  ImageIcon,
  MessageCircleIcon,
  TextIcon,
  VideoIcon,
} from 'lucide-react';

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
        <SelectItem value="text">
          <TextIcon size={16} className="shrink-0" />
          Text
        </SelectItem>
        <SelectItem value="image">
          <ImageIcon size={16} className="shrink-0" />
          Image
        </SelectItem>
        <SelectItem value="video" disabled>
          <VideoIcon size={16} className="shrink-0" />
          Video
        </SelectItem>
        <SelectItem value="speech">
          <MessageCircleIcon size={16} className="shrink-0" />
          Speech
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
