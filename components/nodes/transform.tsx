import { Handle, Position } from '@xyflow/react';
import Markdown from 'react-markdown';

type TransformNodeProps = {
  data: {
    content?: string;
    updatedAt?: string;
  };
  id: string;
};

export const TransformNode = ({ data, id }: TransformNodeProps) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div className="divide-y">
      {process.env.NODE_ENV === 'development' && (
        <div className="p-4">
          <code className="text-muted-foreground text-xs">{id}</code>
        </div>
      )}
      <div className="p-4">
        <Markdown>{data.content}</Markdown>
      </div>
      <div className="flex items-center justify-between p-4">
        <p className="text-muted-foreground text-sm">
          Last updated: {data.updatedAt}
        </p>
      </div>
    </div>
    <Handle type="source" position={Position.Right} />
  </>
);
