'use client';

import {
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { useCallback, useState } from 'react';
import { ImageNode } from './nodes/image';
import { TextNode } from './nodes/text';
import { TransformNode } from './nodes/transform';
import { Toolbar } from './toolbar';

const nodeTypes = {
  image: ImageNode,
  text: TextNode,
  transform: TransformNode,
};

export const Canvas = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${nodes.length}`,
      type,
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
      nodeTypes={nodeTypes}
      fitView
    >
      <Controls />
      <Background />
      <Toolbar addNode={addNode} />
    </ReactFlow>
  );
};
