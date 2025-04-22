'use server';

import { imageModels } from '@/lib/models';
import { experimental_generateImage as generateImage } from 'ai';

export const generateImageAction = async (prompt: string, modelId: string) => {
  const model = imageModels
    .flatMap((m) => m.models)
    .find((m) => m.id === modelId)?.model;

  if (!model) {
    throw new Error('Model not found');
  }

  const { image } = await generateImage({
    model,
    prompt,
  });

  return image.uint8Array;
};
