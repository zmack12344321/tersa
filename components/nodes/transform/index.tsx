import { useReactFlow } from '@xyflow/react';
import { TransformImageNode } from './image';
import { TransformSpeechNode } from './speech';
import { TransformTextNode } from './text';
import { TransformVideoNode } from './video';

type TransformNodeProps = {
  text?: string[];
  data: {
    text?: string[];
    type?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformNode = ({ id }: TransformNodeProps) => {
  const { getNode } = useReactFlow();
  const node = getNode(id);

  if (!node) {
    return null;
  }

  switch (node.data.type) {
    case 'image':
      return <TransformImageNode data={node.data} id={id} text={[]} />;
    case 'video':
      return <TransformVideoNode data={node.data} id={id} text={[]} />;
    case 'speech':
      return <TransformSpeechNode data={node.data} id={id} text={[]} />;
    default:
      return <TransformTextNode data={node.data} id={id} text={[]} />;
  }
};
