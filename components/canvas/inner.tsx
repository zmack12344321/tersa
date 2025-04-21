'use client';

import {
  Background,
  type Connection,
  Controls,
  type Edge,
  type FinalConnectionState,
  type InternalNode,
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
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
} from 'react';
import { Auth } from '../auth';
import { ConnectionLine } from '../connection-line';
import { AnimatedEdge } from '../edges/animated';
import { TemporaryEdge } from '../edges/temporary';
import { AudioNode } from '../nodes/audio';
import { DropNode } from '../nodes/drop';
import { ImageNode } from '../nodes/image';
import { TextNode } from '../nodes/text';
import { TransformNode } from '../nodes/transform';
import { VideoNode } from '../nodes/video';
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

const MIN_DISTANCE = 150;

export const CanvasInner = () => {
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

  const getClosestEdge = useCallback(
    (node: Node) => {
      const { nodeLookup } = store.getState();
      const internalNode = getInternalNode(node.id);

      if (!internalNode) {
        return null;
      }

      const closestNode = Array.from(nodeLookup.values()).reduce<{
        distance: number;
        node: InternalNode<Node> | null;
      }>(
        (res, n) => {
          if (n.id !== internalNode.id) {
            const dx =
              n.internals.positionAbsolute.x -
              internalNode.internals.positionAbsolute.x;
            const dy =
              n.internals.positionAbsolute.y -
              internalNode.internals.positionAbsolute.y;
            const d = Math.sqrt(dx * dx + dy * dy);

            if (d < res.distance && d < MIN_DISTANCE) {
              res.distance = d;
              res.node = n;
            }
          }

          return res;
        },
        {
          distance: Number.MAX_VALUE,
          node: null,
        }
      );

      if (!closestNode.node) {
        return null;
      }

      const closeNodeIsSource =
        closestNode.node.internals.positionAbsolute.x <
        internalNode.internals.positionAbsolute.x;

      return {
        id: closeNodeIsSource
          ? `${closestNode.node.id}-${node.id}`
          : `${node.id}-${closestNode.node.id}`,
        source: closeNodeIsSource ? closestNode.node.id : node.id,
        target: closeNodeIsSource ? node.id : closestNode.node.id,
      };
    },
    [store, getInternalNode]
  );

  const onNodeDrag = useCallback(
    (_: ReactMouseEvent, node: Node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          closeEdge.className = 'temp';
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_: ReactMouseEvent, node: Node) => {
      const closeEdge = getClosestEdge(node);

      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== 'temp');

        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          nextEdges.push(closeEdge);
        }

        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
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
      onNodeDrag={onNodeDrag}
      isValidConnection={isValidConnection}
      onNodeDragStop={onNodeDragStop}
      connectionLineComponent={ConnectionLine}
      fitView
    >
      <Controls
        orientation="horizontal"
        className="rounded-full border bg-card/90 p-1 shadow-none! drop-shadow-xs backdrop-blur-sm"
        showInteractive={false}
      />
      <Background bgColor="var(--secondary)" />
      <Toolbar addNode={addNode} buttons={buttons} />
      <Auth />
    </ReactFlow>
  );
};
