'use server';

import { database } from '@/lib/database';
import { projects } from '@/schema';
import { currentUser } from '@clerk/nextjs/server';

export const createProjectAction = async (
  name: string
): Promise<
  | {
      id: number;
    }
  | {
      error: string;
    }
> => {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const project = await database
      .insert(projects)
      .values({
        name,
        userId: user.id,
        transcriptionModel: 'gpt-4o-mini-transcribe',
        visionModel: 'gpt-4.1-nano',
      })
      .returning({ id: projects.id });

    if (!project?.length) {
      throw new Error('Failed to create project');
    }

    return { id: project[0].id };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';

    return { error: message };
  }
};
