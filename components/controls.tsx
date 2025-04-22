'use client';

import { Controls as FlowControls } from '@xyflow/react';
import dynamic from 'next/dynamic';

const ThemeSwitcher = dynamic(
  () => import('./theme-switcher').then((mod) => mod.ThemeSwitcher),
  { ssr: false }
);

export const Controls = () => (
  <FlowControls
    orientation="horizontal"
    className="rounded-full border bg-card/90 p-1 shadow-none! drop-shadow-xs backdrop-blur-sm"
    showInteractive={false}
  >
    <ThemeSwitcher />
  </FlowControls>
);
