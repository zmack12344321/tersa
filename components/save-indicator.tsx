import { Panel } from '@xyflow/react';
import { Loader2Icon } from 'lucide-react';

type SaveIndicatorProps = {
  lastSaved: Date | null;
  saving: boolean;
};

export const SaveIndicator = ({ lastSaved, saving }: SaveIndicatorProps) => (
  <Panel
    position="bottom-right"
    className="flex items-center gap-1 rounded-full border bg-card/90 p-3 drop-shadow-xs backdrop-blur-sm"
  >
    {lastSaved && (
      <span className="mx-1 text-muted-foreground text-sm">
        Last saved:{' '}
        {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
          Math.round((lastSaved.getTime() - Date.now()) / 1000 / 60),
          'seconds'
        )}
      </span>
    )}
    {saving && <Loader2Icon size={16} className="animate-spin text-primary" />}
  </Panel>
);
