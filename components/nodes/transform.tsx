import { Handle, Position } from '@xyflow/react';
import Markdown from 'react-markdown';

type TransformNodeData = {
  content?: string;
  updatedAt?: string;
};

export const TransformNode = ({ data }: { data: TransformNodeData }) => (
  <>
    <Handle type="target" position={Position.Left} />
    <div className="divide-y">
      <div className="p-4">
        <Markdown>{data.content}</Markdown>
      </div>
      <div className="p-4">
        <p className="text-muted-foreground text-sm">
          Last updated: {data.updatedAt}
        </p>
      </div>
    </div>
    <Handle type="source" position={Position.Right} />
  </>
);
