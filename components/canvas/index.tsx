import { ReactFlowProvider } from '@xyflow/react';
import type { ComponentProps } from 'react';
import { CanvasInner } from './inner';

type CanvasProps = {
  projects: ComponentProps<typeof CanvasInner>['projects'];
  data: ComponentProps<typeof CanvasInner>['data'];
};

export const Canvas = ({ projects, data }: CanvasProps) => (
  <ReactFlowProvider>
    <CanvasInner projects={projects} data={data} />
  </ReactFlowProvider>
);
