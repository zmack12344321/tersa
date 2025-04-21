import { ReactFlowProvider } from '@xyflow/react';
import { CanvasInner } from './inner';

export const Canvas = () => (
  <ReactFlowProvider>
    <CanvasInner />
  </ReactFlowProvider>
);
