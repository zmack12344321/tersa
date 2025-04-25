'use server';

import { transcriptionModels } from '@/lib/models';
import { experimental_transcribe as transcribe } from 'ai';

export const transcribeAction = async (
  url: string
): Promise<
  | {
      transcript: string;
    }
  | {
      error: string;
    }
> => {
  try {
    // TODO: Make this configurable
    const model = transcriptionModels
      .at(0)
      ?.models.find((model) => model.id === 'gpt-4o-mini-transcribe')?.model;

    if (!model) {
      throw new Error('No model found');
    }

    const transcript = await transcribe({
      model,
      audio: new URL(url),
    });

    return {
      transcript: transcript.text,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
