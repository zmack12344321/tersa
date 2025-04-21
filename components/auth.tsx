import { UserButton } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { SignedOut } from '@clerk/nextjs';
import { Panel } from '@xyflow/react';
import Link from 'next/link';
import { Button } from './ui/button';

export const Auth = () => (
  <Panel position="top-right">
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
