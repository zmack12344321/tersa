import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { type XYPosition, useReactFlow } from '@xyflow/react';
import { BrainIcon, ImageIcon, TextIcon, VideoIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { NodeLayout } from './layout';

type DropNodeProps = {
  data: {
    position: XYPosition;
  };
  id: string;
};

const buttons = [
  {
    id: 'text',
    label: 'Text',
    icon: TextIcon,
  },
  {
    id: 'image',
    label: 'Image',
    icon: ImageIcon,
  },
  {
    id: 'video',
    label: 'Video',
    icon: VideoIcon,
  },
  {
    id: 'transform',
    label: 'Transform',
    icon: BrainIcon,
  },
];

export const DropNode = ({ data, id }: DropNodeProps) => {
  const { addNodes, deleteElements, getNode, addEdges, getNodeConnections } =
    useReactFlow();

  const handleSelect = (type: string) => {
    // Get the position of the current node
    const currentNode = getNode(id);
    const position = currentNode?.position || { x: 0, y: 0 };
    const sourceNodes = getNodeConnections({
      nodeId: id,
    });

    // Delete the drop node
    deleteElements({
      nodes: [{ id }],
    });

    const newNodeId = nanoid();

    // Add the new node of the selected type
    addNodes({
      id: newNodeId,
      type,
      position,
      data: {},
      origin: [0, 0.5],
    });

    for (const sourceNode of sourceNodes) {
      addEdges({
        id: nanoid(),
        source: sourceNode.source,
        target: newNodeId,
      });
    }
  };

  return (
    <NodeLayout id={id} data={data} type="Add a node">
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Add node">
            {buttons.map((button) => (
              <CommandItem
                key={button.id}
                onSelect={() => handleSelect(button.id)}
              >
                <button.icon size={16} />
                {button.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </NodeLayout>
  );
};
