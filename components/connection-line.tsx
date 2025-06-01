import type { ConnectionLineComponentProps } from '@xyflow/react';

export const ConnectionLine = ({
  fromX,
  fromY,
  toX,
  toY,
}: ConnectionLineComponentProps) => (
  <g>
    <path
      fill="none"
      stroke="var(--color-ring)"
      strokeWidth={1}
      className="animated"
      d={`M${fromX},${fromY} C ${fromX + (toX - fromX) * 0.5},${fromY} ${fromX + (toX - fromX) * 0.5},${toY} ${toX},${toY}`}
    />
    <circle
      cx={toX}
      cy={toY}
      fill="#fff"
      r={3}
      stroke="var(--color-ring)"
      strokeWidth={1}
    />
  </g>
);
