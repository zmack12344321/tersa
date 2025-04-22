import { OrganizationSwitcher, UserButton } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { SignedOut } from '@clerk/nextjs';
import { Panel } from '@xyflow/react';
import Link from 'next/link';
import { Button } from './ui/button';

export const Auth = () => (
  <Panel
    position="top-right"
    className="left-0! flex items-center justify-between gap-1 sm:left-auto!"
  >
    <SignedOut>
      <Button size="sm" className="ml-2 rounded-full" asChild>
        <Link href="/sign-in">Log in</Link>
      </Button>
    </SignedOut>
    <SignedIn>
      <div className="flex items-center gap-1 rounded-full border bg-card/90 p-1 drop-shadow-xs backdrop-blur-sm">
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: 'rounded-full! py-1! pl-1!',
              userPreviewAvatarBox: 'rounded-full! size-7!',
            },
          }}
        />
      </div>
      <div className="flex items-center gap-1 rounded-full border bg-card/90 p-2 drop-shadow-xs backdrop-blur-sm">
        <UserButton />
      </div>
    </SignedIn>
  </Panel>
);
