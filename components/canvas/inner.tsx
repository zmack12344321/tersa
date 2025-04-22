'use client';

import type { projects } from '@/schema';
import {
  Background,
  type Connection,
  type Edge,
  type FinalConnectionState,
  type Node,
  ReactFlow,
  type XYPosition,
  addEdge,
  getOutgoers,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useStoreApi,
} from '@xyflow/react';
import { AudioWaveformIcon, BrainIcon, VideoIcon } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import { TextIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect } from 'react';
import { Auth } from '../auth';
import { ConnectionLine } from '../connection-line';
import { Controls } from '../controls';
import { AnimatedEdge } from '../edges/animated';
import { TemporaryEdge } from '../edges/temporary';
import { AudioNode } from '../nodes/audio';
import { DropNode } from '../nodes/drop';
import { ImageNode } from '../nodes/image';
import { TextNode } from '../nodes/text';
import { TransformNode } from '../nodes/transform';
import { VideoNode } from '../nodes/video';
import { Projects } from '../projects';
import { Toolbar } from '../toolbar';

const nodeTypes = {
  image: ImageNode,
  text: TextNode,
  transform: TransformNode,
  drop: DropNode,
  video: VideoNode,
  audio: AudioNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
  temporary: TemporaryEdge,
};

type CanvasProps = {
  projects: (typeof projects.$inferSelect)[];
  data: typeof projects.$inferSelect;
};

export const CanvasInner = ({ projects, data }: CanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { getEdges, getInternalNode, screenToFlowPosition, getNodes } =
    useReactFlow();
  const store = useStoreApi();

  const addNode = useCallback(
    (type: string, position?: XYPosition, data?: Record<string, unknown>) => {
      const newNode: Node = {
        id: nanoid(),
        type,
        data: data ?? {},
        position: position ?? { x: 0, y: 0 },
        origin: [0, 0.5],
      };

      setNodes((nds) => nds.concat(newNode));

      return newNode.id;
    },
    [setNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: 'animated' }, eds));
    },
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => {
      // when a connection is dropped on the pane it's not valid

      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;

        const newNodeId = addNode(
          'drop',
          screenToFlowPosition({ x: clientX, y: clientY })
        );

        setEdges((eds) =>
          eds.concat({
            id: newNodeId,
            source: connectionState.fromNode?.id ?? '',
            target: newNodeId,
            type: 'temporary',
          })
        );
      }
    },
    [addNode, screenToFlowPosition, setEdges]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      const hasCycle = (node: Node, visited = new Set<string>()) => {
        if (visited.has(node.id)) {
          return false;
        }

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source || hasCycle(outgoer, visited)) {
            return true;
          }
        }
      };

      if (!target || target.id === connection.source) {
        return false;
      }

      return !hasCycle(target);
    },
    [getNodes, getEdges]
  );

  const onConnectStart = useCallback(() => {
    // Delete any drop nodes when starting to drag a node
    setNodes((nds) => nds.filter((n) => n.type !== 'drop'));

    // Also remove any temporary edges
    setEdges((eds) => eds.filter((e) => e.type !== 'temporary'));
  }, [setEdges, setNodes]);

  const buttons = [
    {
      id: 'text',
      label: 'Text',
      icon: TextIcon,
      onClick: () => addNode('text'),
    },
    {
      id: 'image',
      label: 'Image',
      icon: ImageIcon,
      onClick: () => addNode('image'),
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: AudioWaveformIcon,
      onClick: () => addNode('audio'),
    },
    {
      id: 'video',
      label: 'Video',
      icon: VideoIcon,
      onClick: () => addNode('video'),
    },
    {
      id: 'transform',
      label: 'Transform',
      icon: BrainIcon,
      onClick: () => addNode('transform', undefined, { type: 'text' }),
    },
  ];

  useEffect(() => {
    // Add keyboard shortcut for selecting all nodes (Cmd/Ctrl + A)
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for meta key (Cmd on Mac, Ctrl on Windows) + A
      if ((event.metaKey || event.ctrlKey) && event.key === 'a') {
        event.preventDefault(); // Prevent default browser select all behavior

        // Select all nodes by setting their selected property to true
        setNodes((nodes) =>
          nodes.map((node) => ({
            ...node,
            selected: true,
          }))
        );
      }
    };

    // Add event listener when component mounts
    window.addEventListener('keydown', handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      onNodesChange={onNodesChange}
      edges={edges}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnect={onConnect}
      onConnectEnd={onConnectEnd}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      isValidConnection={isValidConnection}
      connectionLineComponent={ConnectionLine}
      fitView
    >
      <Controls />
      <Background bgColor="var(--secondary)" />
      <Toolbar addNode={addNode} buttons={buttons} />
      <Auth />
      <Projects projects={projects} currentProject={data.id.toString()} />
    </ReactFlow>
  );
};
