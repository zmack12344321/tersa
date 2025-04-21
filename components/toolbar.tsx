import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Panel } from '@xyflow/react';
import { ImageIcon, VideoIcon } from 'lucide-react';
import { TextIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

type ToolbarProps = {
  addNode: (type: string) => void;
};

export const Toolbar = ({ addNode }: ToolbarProps) => {
  const addButtons = [
    {
      id: 'text',
      icon: TextIcon,
      onClick: () => addNode('text'),
    },
    {
      id: 'image',
      icon: ImageIcon,
      onClick: () => addNode('image'),
    },
    {
      id: 'video',
      icon: VideoIcon,
      onClick: () => addNode('video'),
    },
  ];

  return (
    <Panel
      position="bottom-center"
      className="flex items-center gap-1 rounded-full border bg-background/90 p-1 drop-shadow-xs backdrop-blur-sm"
    >
      {addButtons.map((button) => (
        <Button
          key={button.id}
          onClick={button.onClick}
          type="button"
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <button.icon size={16} />
        </Button>
      ))}
      <div className="h-7 w-px bg-border" />
      <SignedOut>
        <Button size="sm" className="ml-2 rounded-full" asChild>
          <Link href="/sign-in">Log in</Link>
        </Button>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </Panel>
  );
};
