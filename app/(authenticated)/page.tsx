import { database } from '@/lib/database';
import { projects } from '@/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tersa',
  description: 'Create and share AI workflows',
};

const Home = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect('/sign-in');
  }

  const allProjects = await database
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id));

  if (!allProjects.length) {
    const newProject = await database
      .insert(projects)
      .values({
        name: 'Untitled Project',
        userId: user.id,
      })
      .returning();

    return redirect(`/projects/${newProject[0].id}`);
  }

  redirect(`/projects/${allProjects[0].id}`);
};

export default Home;
