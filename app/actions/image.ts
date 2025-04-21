'use server';

import { openai } from '@ai-sdk/openai';
import { experimental_generateImage as generateImage } from 'ai';

export const generateImageAction = async (prompt: string) => {
  const { image } = await generateImage({
    model: openai.image('dall-e-3'),
    prompt,
    aspectRatio: '16:9',
  });

  return image.uint8Array;
};
