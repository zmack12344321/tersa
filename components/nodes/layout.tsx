import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Handle, NodeResizeControl, Position } from '@xyflow/react';
import { ChevronsUpDownIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../ui/button';

type NodeLayoutProps = {
  children: ReactNode;
  id: string;
  data?: object;
  type: string;
  action?: ReactNode;
};

export const NodeLayout = ({
  children,
  type,
  id,
  data,
  action,
}: NodeLayoutProps) => (
  <>
    <NodeResizeControl minWidth={300} minHeight={162} />
    <Handle type="target" position={Position.Left} />
    <div className="flex h-full flex-col divide-y">
      <div className="flex shrink-0 items-center justify-between rounded-t-lg bg-secondary px-4 py-3">
        <p className="text-sm">{type}</p>
        {action}
      </div>
      <div className="flex-1">{children}</div>
      {process.env.NODE_ENV === 'development' && (
        <Collapsible className="shrink-0 rounded-b-lg bg-secondary px-4 py-3 font-mono text-muted-foreground text-xs">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm">{id}</p>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronsUpDownIcon className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
    <Handle type="source" position={Position.Right} />
  </>
);
