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
  useReactFlow,
} from '@xyflow/react';
import { nanoid } from 'nanoid';
import { useCallback, useState } from 'react';
import { Auth } from '../auth';
import { ImageNode } from '../nodes/image';
import { TextNode } from '../nodes/text';
import { TransformNode } from '../nodes/transform';
import { Toolbar } from '../toolbar';

const nodeTypes = {
  image: ImageNode,
  text: TextNode,
  transform: TransformNode,
};

// Inner component with access to ReactFlow hooks
export const CanvasInner = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const reactFlowInstance = useReactFlow();

  // Helper function to find only downstream transform nodes (one-way traversal)
  const findDownstreamTransformNodes = useCallback(
    (nodeId: string, visited: Set<string>) => {
      // Get the latest edges directly from ReactFlow
      const currentEdges = reactFlowInstance.getEdges();
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
      const outgoingEdges = currentEdges.filter(
        (edge) => edge.source === nodeId
      );

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
    [nodes, reactFlowInstance]
  );

  const getUpstreamTexts = useCallback(
    (nodeId: string, visited = new Set<string>()) => {
      // Get the latest edges directly from ReactFlow
      const currentEdges = reactFlowInstance.getEdges();

      // Prevent cycles
      if (visited.has(nodeId)) {
        return [];
      }

      visited.add(nodeId);
      const upstreamTexts: string[] = [];

      // Get all incoming edges to this node using the latest edges
      const incomingEdges = currentEdges.filter(
        (edge) => edge.target === nodeId
      );

      console.log('Incoming edges:', currentEdges, incomingEdges);

      for (const edge of incomingEdges) {
        const sourceNode = nodes.find((node) => node.id === edge.source);

        console.log('Source node:', sourceNode);

        // If the source is a text node, add its content
        if (
          sourceNode?.type === 'text' &&
          typeof sourceNode.data.text === 'string'
        ) {
          upstreamTexts.push(sourceNode.data.text);
        }

        // Recursively get content from nodes connected to this source
        const sourceUpstreamTexts = getUpstreamTexts(edge.source, visited);
        upstreamTexts.push(...sourceUpstreamTexts);
      }

      return upstreamTexts;
    },
    [nodes, reactFlowInstance]
  );

  const updateTransformNode = useCallback(
    (nodeId: string) => {
      const upstreamTexts = getUpstreamTexts(nodeId);

      // Get the node we need to update
      const node = nodes.find((n) => n.id === nodeId);

      if (node?.type === 'transform') {
        console.log(
          'Transform node found:',
          node.id,
          'with upstream texts:',
          upstreamTexts
        );

        // Update the node data with the upstream texts
        setNodes((nds) =>
          nds.map((n) => {
            if (n.id === nodeId) {
              // Preserve existing data and add/update upstreamTexts
              return {
                ...n,
                data: {
                  ...n.data,
                  text: upstreamTexts,
                },
              };
            }
            return n;
          })
        );
      }
    },
    [getUpstreamTexts, nodes]
  );

  const updateTransformNodes = useCallback(
    (nodeIds: Set<string>) => {
      console.log('Updating transform nodes:', nodeIds);
      // Process each transform node
      for (const nodeId of nodeIds) {
        console.log('Updating transform node:', nodeId);
        updateTransformNode(nodeId);
      }
    },
    [updateTransformNode]
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
      id: nanoid(),
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
        updateTransformNodes(transformNodeIds);
      }
    },
    [findDownstreamTransformNodes, updateTransformNodes]
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
      const currentEdges = reactFlowInstance.getEdges();

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
        setTimeout(() => {
          updateTransformNodes(transformNodeIds);
        }, 0);
      }
    },
    [
      findDownstreamTransformNodes,
      updateTransformNodes,
      edges,
      reactFlowInstance,
    ]
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

      if (transformNodeIds.size > 0) {
        // Allow a brief delay for the edge to be added to the state
        setTimeout(() => {
          updateTransformNodes(transformNodeIds);
        }, 0);
      }
    },
    [findDownstreamTransformNodes, updateTransformNodes, nodes]
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
      <Auth />
    </ReactFlow>
  );
};
