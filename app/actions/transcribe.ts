'use server';

import { openai } from '@ai-sdk/openai';
import { experimental_transcribe as transcribe } from 'ai';

export const transcribeAction = async (url: string) => {
  console.log('transcribing', url);

  const transcript = await transcribe({
    model: openai.transcription('gpt-4o-mini-transcribe'),
    audio: new URL(url),
  });

  return transcript.text;
};
