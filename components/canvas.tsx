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

  // Helper function to find only downstream transform nodes (one-way traversal)
  const findDownstreamTransformNodes = useCallback(
    (nodeId: string, visited: Set<string>) => {
      const transformNodeIds = new Set<string>();

      // Prevent cycles
      if (visited.has(nodeId)) {
        return transformNodeIds;
      }

      visited.add(nodeId);

      // Find the current node
      const currentNode = nodes.find((n) => n.id === nodeId);

      // If current node is a transform node, add it to our set
      if (currentNode?.type === 'transform') {
        transformNodeIds.add(nodeId);
      }

      // Find all edges where this node is the source (outgoing edges only)
      const outgoingEdges = edges.filter((edge) => edge.source === nodeId);

      // Process outgoing connections only (downstream)
      for (const edge of outgoingEdges) {
        // Continue traversing from this target node
        const childTransformNodes = findDownstreamTransformNodes(
          edge.target,
          visited
        );
        if (childTransformNodes) {
          for (const id of childTransformNodes) {
            transformNodeIds.add(id);
          }
        }
      }

      return transformNodeIds;
    },
    [nodes, edges]
  );

  // Helper function to recursively traverse connections (bidirectional - keep for node/edge changes)
  const findTransformNodes = useCallback(
    (nodeId: string, visited: Set<string>) => {
      const transformNodeIds = new Set<string>();

      // Prevent cycles
      if (visited.has(nodeId)) {
        return transformNodeIds;
      }

      visited.add(nodeId);

      // Find the current node
      const currentNode = nodes.find((n) => n.id === nodeId);

      // If current node is a transform node, add it to our set
      if (currentNode?.type === 'transform') {
        transformNodeIds.add(nodeId);
      }

      // Find all edges where this node is the source
      const outgoingEdges = edges.filter((edge) => edge.source === nodeId);

      // Find all edges where this node is the target
      const incomingEdges = edges.filter((edge) => edge.target === nodeId);

      // Process outgoing connections
      for (const edge of outgoingEdges) {
        // Continue traversing from this target node
        const childTransformNodes = findTransformNodes(edge.target, visited);
        if (childTransformNodes) {
          for (const id of childTransformNodes) {
            transformNodeIds.add(id);
          }
        }
      }

      // Process incoming connections
      for (const edge of incomingEdges) {
        // Continue traversing from this source node
        const parentTransformNodes = findTransformNodes(edge.source, visited);
        if (parentTransformNodes) {
          for (const id of parentTransformNodes) {
            transformNodeIds.add(id);
          }
        }
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

      // Traverse each node and check for downstream transform nodes
      const transformNodeIds = new Set<string>();

      // Start traversal from each changed node
      for (const nodeId of Array.from(changedNodeIds)) {
        const foundTransformNodes = findDownstreamTransformNodes(
          nodeId,
          new Set<string>()
        );

        if (foundTransformNodes) {
          for (const id of foundTransformNodes) {
            transformNodeIds.add(id);
          }
        }
      }

      // Update transform nodes
      if (transformNodeIds.size > 0) {
        console.log(Array.from(transformNodeIds), 'onNodesChange');
      }
    },
    [findDownstreamTransformNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));

      // Filter relevant changes
      const changedEdgeIds = new Set<string>();

      for (const change of changes) {
        if (change.type === 'add' && change.item.id) {
          changedEdgeIds.add(change.item.id);
        }

        if (change.type === 'remove' && change.id) {
          changedEdgeIds.add(change.id);
        }

        if (change.type === 'replace' && change.item.id) {
          changedEdgeIds.add(change.item.id);
        }
      }

      // For edge changes, we need to find the target nodes of each changed edge
      const changedTargetNodeIds = new Set<string>();

      // Get all edges in current state (after applying changes)
      const currentEdges = applyEdgeChanges(changes, edges);

      // For each changed edge, find the target node
      for (const edgeId of Array.from(changedEdgeIds)) {
        // Find the edge in the current state
        const changedEdge = currentEdges.find((edge) => edge.id === edgeId);

        // For removed edges, the edge won't be in currentEdges,
        // so we need to check the original edges
        const edge = changedEdge || edges.find((edge) => edge.id === edgeId);

        if (edge?.target) {
          changedTargetNodeIds.add(edge.target);
        }
      }

      // Traverse each affected target node and check for downstream transform nodes
      const transformNodeIds = new Set<string>();

      // Start traversal from each affected target node
      for (const nodeId of Array.from(changedTargetNodeIds)) {
        const foundTransformNodes = findDownstreamTransformNodes(
          nodeId,
          new Set<string>()
        );

        if (foundTransformNodes) {
          for (const id of foundTransformNodes) {
            transformNodeIds.add(id);
          }
        }
      }

      if (transformNodeIds.size > 0) {
        // Update transform nodes
        console.log(Array.from(transformNodeIds), 'onEdgesChange');
      }
    },
    [edges, findDownstreamTransformNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));

      // Create a set to store all affected transform nodes
      const transformNodeIds = new Set<string>();

      // First check if the target itself is a transform node
      const targetNode = nodes.find((n) => n.id === params.target);
      if (targetNode?.type === 'transform') {
        transformNodeIds.add(params.target);
      }

      // Then find all downstream transform nodes from the target
      const foundTransformNodes = findDownstreamTransformNodes(
        params.target,
        new Set<string>()
      );

      // Add all found transform nodes to our set
      if (foundTransformNodes) {
        for (const id of foundTransformNodes) {
          transformNodeIds.add(id);
        }
      }

      // If we have any transform nodes affected, log them
      if (transformNodeIds.size > 0) {
        console.log(Array.from(transformNodeIds), 'onConnect');
      }
    },
    [findDownstreamTransformNodes, nodes]
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
