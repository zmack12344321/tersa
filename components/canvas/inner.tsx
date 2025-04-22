'use client';

import { saveProjectAction } from '@/app/actions/save';
import type { projects } from '@/schema';
import {
  Background,
  type Connection,
  type Edge,
  type EdgeChange,
  type FinalConnectionState,
  type Node,
  type NodeChange,
  ReactFlow,
  type ReactFlowInstance,
  type Viewport,
  type XYPosition,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getOutgoers,
  useReactFlow,
} from '@xyflow/react';
import { AudioWaveformIcon, BrainIcon, VideoIcon } from 'lucide-react';
import { ImageIcon } from 'lucide-react';
import { TextIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
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
import { SaveIndicator } from '../save-indicator';
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
  data: typeof projects.$inferSelect & {
    content:
      | { nodes: Node[]; edges: Edge[]; x: number; y: number; zoom: number }
      | undefined;
  };
};

export const CanvasInner = ({ projects, data }: CanvasProps) => {
  const [nodes, setNodes] = useState<Node[]>(data.content?.nodes ?? []);
  const [edges, setEdges] = useState<Edge[]>(data.content?.edges ?? []);
  const [viewport, setViewport] = useState<Viewport | undefined>({
    x: data.content?.x ?? 0,
    y: data.content?.y ?? 0,
    zoom: data.content?.zoom ?? 1,
  });
  const { getEdges, screenToFlowPosition, getNodes } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const save = useDebouncedCallback(async (source: string) => {
    if (!rfInstance) {
      toast.error('No instance found');
      return;
    }

    if (isSaving) {
      return;
    }

    console.log('saving', source);

    try {
      setIsSaving(true);

      const content = rfInstance.toObject();
      const response = await saveProjectAction(data.id, content);

      if ('error' in response) {
        throw new Error(response.error);
      }

      setLastSaved(new Date());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }, 2000);

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
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: 'animated' }, eds));
      save('onConnect');
    },
    [save]
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
    [addNode, screenToFlowPosition]
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
  }, []);

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

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      save('onNodesChange');
    },
    [save]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
      save('onEdgesChange');
    },
    [save]
  );

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
  }, []);

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
      onInit={setRfInstance}
      fitView
      viewport={viewport}
      onViewportChange={setViewport}
    >
      <Controls />
      <Background bgColor="var(--secondary)" />
      <Toolbar addNode={addNode} buttons={buttons} />
      <Auth />
      <Projects projects={projects} currentProject={data.id.toString()} />
      <SaveIndicator
        lastSaved={lastSaved ?? data.updatedAt}
        saving={isSaving}
      />
    </ReactFlow>
  );
};
