'use server';

import { database } from '@/lib/database';
import { projects } from '@/schema';
import { currentUser } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';

export const saveProjectAction = async (
  projectId: number,
  data: {
    image: string;
    content: object;
  }
): Promise<
  | {
      sucess: true;
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
      .update(projects)
      .set({
        content: data.content,
        image: data.image,
        updatedAt: new Date(),
      })
      .where(and(eq(projects.id, projectId), eq(projects.userId, user.id)));

    if (!project) {
      throw new Error('Project not found');
    }

    return { sucess: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { error: message };
  }
};
