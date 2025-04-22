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
