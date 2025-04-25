'use server';

import { type PutBlobResult, put } from '@vercel/blob';
import { nanoid } from 'nanoid';
import OpenAI, { toFile } from 'openai';

export const editImageAction = async (
  images: PutBlobResult[],
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
    const openai = new OpenAI();

    const promptImages = await Promise.all(
      images.map(async (image) => {
        const response = await fetch(image.url);
        const blob = await response.blob();

        return toFile(blob, image.pathname, {
          type: image.contentType,
        });
      })
    );

    const defaultPrompt =
      images.length > 1
        ? 'Create a variant of the image.'
        : 'Create a single variant of the images.';

    const response = await openai.images.edit({
      model: 'gpt-image-1',
      image: promptImages,
      prompt: instructions ?? defaultPrompt,
    });

    const json = response.data?.at(0)?.b64_json;

    if (!json) {
      throw new Error('No url found');
    }

    const bytes = Buffer.from(json, 'base64');
    const filename = nanoid();

    const blob = await put(`${filename}.png`, bytes, {
      access: 'public',
    });

    return {
      url: blob.url,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
