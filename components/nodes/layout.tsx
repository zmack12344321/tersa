import {
  Handle,
  NodeResizeControl,
  NodeToolbar,
  Position,
  useReactFlow,
} from '@xyflow/react';
import { CodeIcon, EyeIcon, TrashIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type NodeLayoutProps = {
  children: ReactNode;
  id: string;
  data?: Record<string, unknown> & {
    model?: string;
    type?: string;
    content?: object;
    forceToolbarVisible?: boolean;
    toolbarPosition?: Position;
  };
  type: string;
  caption?: string;
  toolbar?: {
    tooltip?: string;
    children: ReactNode;
  }[];
};

export const NodeLayout = ({
  children,
  type,
  id,
  data,
  caption,
  toolbar,
}: NodeLayoutProps) => {
  const { deleteElements, setCenter, getNode } = useReactFlow();

  const handleDelete = () => {
    deleteElements({
      nodes: [{ id }],
    });
  };

  const handleFocus = () => {
    const node = getNode(id);

    if (!node) {
      return;
    }

    const { x, y } = node.position;
    const width = node.measured?.width ?? 0;
    const height = node.measured?.height ?? 0;

    setCenter(x + width / 2, y + height / 2, {
      duration: 1000,
    });
  };

  return (
    <>
      <NodeToolbar
        isVisible={data?.forceToolbarVisible || undefined}
        position={data?.toolbarPosition}
        className="flex items-center gap-1 rounded-full border bg-background/90 p-1 drop-shadow-xs backdrop-blur-sm"
      >
        {toolbar?.map((button, index) =>
          button.tooltip ? (
            <Tooltip key={button.tooltip}>
              <TooltipTrigger asChild>{button.children}</TooltipTrigger>
              <TooltipContent>{button.tooltip}</TooltipContent>
            </Tooltip>
          ) : (
            <Fragment key={index}>{button.children}</Fragment>
          )
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleFocus}
            >
              <EyeIcon size={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Focus</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
              onClick={handleDelete}
            >
              <TrashIcon size={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
        {/* {process.env.NODE_ENV === 'development' && ( */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <CodeIcon size={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <pre>{JSON.stringify({ id, data, type }, null, 2)}</pre>
          </TooltipContent>
        </Tooltip>
        {/* )} */}
      </NodeToolbar>
      <NodeResizeControl minWidth={400} minHeight={170} keepAspectRatio />
      <Handle type="target" position={Position.Left} />
      <div className="relative size-full">
        <div className="-translate-y-full -top-2 absolute right-0 left-0 flex shrink-0 items-center justify-between">
          <p className="font-mono text-muted-foreground text-xs tracking-tighter">
            {type}
          </p>
          {caption && (
            <p className="font-mono text-muted-foreground text-xs tracking-tighter">
              {caption}
            </p>
          )}
        </div>
        <div className="node-container size-full divide-y rounded-lg bg-card ring-1 ring-border transition-all">
          {children}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
