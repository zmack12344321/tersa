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

  // Helper function to recursively traverse connections
  const findTransformNodes = useCallback(
    (sourceId: string, visited: Set<string>) => {
      const transformNodeIds = new Set<string>();

      // Prevent cycles
      if (visited.has(sourceId)) {
        return;
      }

      visited.add(sourceId);

      // Find all edges where this node is the source
      const connectedEdges = edges.filter((edge) => edge.source === sourceId);

      for (const edge of connectedEdges) {
        const targetNode = nodes.find((n) => n.id === edge.target);

        // If target is a transform node, add it to our set
        if (targetNode?.type === 'transform') {
          transformNodeIds.add(edge.target);
        }

        // Continue traversing from this target node
        findTransformNodes(edge.target, visited);
      }

      return transformNodeIds;
    },
    [nodes, edges]
  );

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
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));

      // Filter relevant changes
      const changedNodeIds = new Set<string>();

      for (const change of changes) {
        if (change.type === 'add' && change.item.id) {
          changedNodeIds.add(change.item.id);
        }

        if (change.type === 'remove' && change.id) {
          changedNodeIds.add(change.id);
        }

        if (change.type === 'replace' && change.item.id) {
          changedNodeIds.add(change.item.id);
        }
      }

      // Traverse each node and check if it has a transform node anywhere in the hierarchy
      const transformNodeIds = new Set<string>();

      // Start traversal from each changed node
      for (const nodeId of Array.from(changedNodeIds)) {
        findTransformNodes(nodeId, transformNodeIds);
      }

      // Update transform nodes
      if (transformNodeIds.size > 0) {
        console.log(Array.from(transformNodeIds), 'onNodesChange');
      }
    },
    [findTransformNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));

      // Filter relevant changes
      const changedNodeIds = new Set<string>();

      for (const change of changes) {
        if (change.type === 'add' && change.item.id) {
          changedNodeIds.add(change.item.id);
        }

        if (change.type === 'remove' && change.id) {
          changedNodeIds.add(change.id);
        }

        if (change.type === 'replace' && change.item.id) {
          changedNodeIds.add(change.item.id);
        }
      }

      // Traverse each node and check if it has a transform node anywhere in the hierarchy
      const transformNodeIds = new Set<string>();

      // Start traversal from each changed node
      for (const nodeId of Array.from(changedNodeIds)) {
        findTransformNodes(nodeId, transformNodeIds);
      }

      if (transformNodeIds.size > 0) {
        // Update transform nodes
        console.log(Array.from(transformNodeIds), 'onEdgesChange');
      }
    },
    [findTransformNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));

      // Start traversal from each changed node
      const transformNodeIds = new Set<string>();

      findTransformNodes(params.source, transformNodeIds);

      if (transformNodeIds.size > 0) {
        // Update transform nodes
        console.log(Array.from(transformNodeIds), 'onConnect');
      }
    },
    [findTransformNodes]
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
