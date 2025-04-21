import { TransformImageNode } from './image';
import { TransformTextNode } from './text';

type TransformNodeProps = {
  text?: string[];
  data: {
    text?: string[];
    type?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformNode = ({ data, id, text }: TransformNodeProps) => {
  if (data.type === 'image') {
    return <TransformImageNode data={data} id={id} text={text} />;
  }

  return <TransformTextNode data={data} id={id} text={text} />;
};
