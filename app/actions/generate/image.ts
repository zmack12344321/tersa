'use server';

import { imageModels } from '@/lib/models';
import { put } from '@vercel/blob';
import { experimental_generateImage as generateImage } from 'ai';
import { nanoid } from 'nanoid';

export const generateImageAction = async (
  prompt: string,
  modelId: string,
  instructions?: string
): Promise<
  | {
      url: string;
    }
  | {
      error: string;
    }
> => {
  try {
    const model = imageModels
      .flatMap((m) => m.models)
      .find((m) => m.id === modelId)?.model;

    if (!model) {
      throw new Error('Model not found');
    }

    const { image } = await generateImage({
      model,
      prompt: [
        'Generate an image based on the following instructions and context.',
        '---',
        'Instructions:',
        instructions ?? 'None.',
        '---',
        'Context:',
        prompt,
      ].join('\n'),
    });

    const blob = await put(nanoid(), new Blob([image.uint8Array]), {
      access: 'public',
    });

    return { url: blob.url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
