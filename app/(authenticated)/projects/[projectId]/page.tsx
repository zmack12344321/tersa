import { Canvas } from '@/components/canvas';
import { database } from '@/lib/database';
import { projects } from '@/schema';
import { currentUser } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Tersa',
  description: 'Create and share AI workflows',
};

type ProjectProps = {
  params: Promise<{
    projectId: string;
  }>;
};

const Project = async ({ params }: ProjectProps) => {
  const user = await currentUser();
  const { projectId } = await params;

  if (!user) {
    return redirect('/sign-in');
  }

  const allProjects = await database
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id));

  if (!allProjects.length) {
    notFound();
  }

  const project = allProjects.find(
    (project) => project.id === Number(projectId)
  );

  console.log(allProjects, projectId, Number(projectId));

  if (!project) {
    notFound();
  }

  return (
    <div className="h-screen w-screen">
      <Canvas projects={allProjects} data={project} />
    </div>
  );
};

export default Project;
