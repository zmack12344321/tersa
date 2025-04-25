'use server';

import { openai } from '@ai-sdk/openai';
import { put } from '@vercel/blob';
import { experimental_generateSpeech as generateSpeech } from 'ai';
import { nanoid } from 'nanoid';

export const generateSpeechAction = async (
  text: string
): Promise<
  | {
      url: string;
    }
  | {
      error: string;
    }
> => {
  try {
    const { audio } = await generateSpeech({
      model: openai.speech('gpt-4o-mini-tts'),
      text,
      outputFormat: 'mp3',
    });

    const blob = await put(`${nanoid()}.mp3`, new Blob([audio.uint8Array]), {
      access: 'public',
      contentType: audio.mimeType,
    });

    return { url: blob.url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' };
  }
};
