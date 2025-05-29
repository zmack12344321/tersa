import { currentUser } from '@/lib/auth';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Home from './(unauthenticated)/home/page';
import UnauthenticatedLayout from './(unauthenticated)/layout';

export const metadata: Metadata = {
  title: 'Tersa',
  description: 'Visualize your AI workflows.',
};

const Index = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <UnauthenticatedLayout>
        <Home />
      </UnauthenticatedLayout>
    );
  }

  redirect('/projects');
};

export default Index;
