'use client';

import {
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  Panel,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { PlusIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from './ui/button';

export const Canvas = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const addNode = () => {
    const newNode: Node = {
      id: `${nodes.length}`,
      type: 'default',
      data: { label: `Node ${nodes.length + 1}` },
      position: { x: 0, y: 0 },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Controls />
      <Background />
      <Panel
        position="bottom-center"
        className="flex items-center gap-1 rounded-full border bg-background/90 p-1 drop-shadow-xs backdrop-blur-sm"
      >
        <Button
          onClick={addNode}
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <PlusIcon size={16} />
        </Button>
      </Panel>
    </ReactFlow>
  );
};
