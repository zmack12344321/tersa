import { Panel } from '@xyflow/react';
import { PrimitiveNodes } from './primitive-nodes';
import { TransformNodes } from './transform-nodes';

export const Toolbar = () => (
  <Panel
    position="bottom-center"
    className="flex items-center rounded-full border bg-card/90 p-1 drop-shadow-xs backdrop-blur-sm"
  >
    <PrimitiveNodes />
    <TransformNodes />
  </Panel>
);
