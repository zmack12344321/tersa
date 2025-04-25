import type { AudioNodeProps } from '@/components/nodes/audio';
import type { ImageNodeProps } from '@/components/nodes/image';
import type { TextNodeProps } from '@/components/nodes/text';
import { type Edge, type Node, getIncomers } from '@xyflow/react';

export const getRecursiveIncomers = (
  nodeId: string,
  nodes: Node[],
  edges: Edge[],
  visited = new Set<string>()
): Node[] => {
  if (visited.has(nodeId)) {
    return [];
  }

  visited.add(nodeId);

  const directIncomers = getIncomers({ id: nodeId }, nodes, edges);
  const allIncomers: Node[] = [...directIncomers];

  for (const incomer of directIncomers) {
    const recursiveIncomers = getRecursiveIncomers(
      incomer.id,
      nodes,
      edges,
      visited
    );
    allIncomers.push(...recursiveIncomers);
  }

  return allIncomers;
};

export const getTextFromTextNodes = (nodes: Node[]) => {
  return nodes
    .filter((node) => node.type === 'text')
    .map((node) => (node.data as TextNodeProps['data']).text)
    .filter(Boolean)
    .join('\n');
};

export const getTranscriptionFromAudioNodes = (nodes: Node[]) => {
  const transcripts = nodes
    .filter((node) => node.type === 'audio')
    .map((node) => (node.data as AudioNodeProps['data']).transcript)
    .filter(Boolean) as string[];

  return transcripts.join('\n');
};

export const getDescriptionsFromImageNodes = (nodes: Node[]) => {
  const descriptions = nodes
    .filter((node) => node.type === 'image')
    .map((node) => (node.data as ImageNodeProps['data']).description)
    .filter(Boolean) as string[];

  return descriptions.join('\n');
};

export const getImageURLsFromImageNodes = (nodes: Node[]) => {
  return nodes
    .filter((node) => node.type === 'image')
    .map((node) => (node.data as ImageNodeProps['data']).content?.downloadUrl)
    .filter(Boolean) as string[];
};

export const isValidSourceTarget = (source: Node, target: Node) => {
  if (source.type === 'video') {
    return false;
  }

  return true;
};
