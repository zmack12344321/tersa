import { UserButton } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { SignedOut } from '@clerk/nextjs';
import { Panel } from '@xyflow/react';
import Link from 'next/link';
import { ThemeSwitcher } from './theme-switcher';
import { Button } from './ui/button';

export const Auth = () => (
  <Panel
    position="bottom-right"
    className="flex items-center gap-1 rounded-full border bg-card/90 p-[3px] drop-shadow-xs backdrop-blur-sm"
  >
    <div className="flex items-center">
      <ThemeSwitcher />
    </div>
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
