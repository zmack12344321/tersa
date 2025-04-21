import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Handle, Position } from '@xyflow/react';
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
    <Handle type="target" position={Position.Left} />
    <div className="divide-y">
      <div className="flex items-center justify-between rounded-t-lg bg-secondary px-4 py-3">
        <p className="text-sm">{type}</p>
        {action}
      </div>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <Collapsible className="rounded-b-lg bg-secondary px-4 py-3 font-mono text-muted-foreground text-xs">
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
