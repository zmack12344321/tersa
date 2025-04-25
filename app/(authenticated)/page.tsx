import { database } from '@/lib/database';
import { projects } from '@/schema';
import { Waitlist } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Background from '../(unauthenticated)/background.jpg';
import { createProjectAction } from '../actions/project/create';

export const metadata: Metadata = {
  title: 'Tersa',
  description: 'Join the waitlist to get early access to Tersa.',
};

const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="relative flex h-screen w-full items-center justify-center p-8">
        <Image
          src={Background}
          alt="Background"
          className="absolute inset-0 size-full object-cover"
          placeholder="blur"
        />
        <Waitlist />
      </div>
    );
  }

  const allProjects = await database
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id));

  if (!allProjects.length) {
    const newProject = await createProjectAction('Untitled Project');

    if ('error' in newProject) {
      throw new Error(newProject.error);
    }

    return redirect(`/projects/${newProject.id}`);
  }

  redirect(`/projects/${allProjects[0].id}`);
};

export default Home;
