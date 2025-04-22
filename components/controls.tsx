import { Controls as FlowControls } from '@xyflow/react';
import { ThemeSwitcher } from './theme-switcher';

export const Controls = () => (
  <FlowControls
    orientation="horizontal"
    className="rounded-full border bg-card/90 p-1 shadow-none! drop-shadow-xs backdrop-blur-sm"
    showInteractive={false}
  >
    <ThemeSwitcher />
  </FlowControls>
);
