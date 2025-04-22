'use server';

import { openai } from '@ai-sdk/openai';
import { experimental_transcribe as transcribe } from 'ai';

export const transcribeAction = async (audio: Uint8Array) => {
  const transcript = await transcribe({
    model: openai.transcription('whisper-1'),
    audio,
  });

  return transcript.text;
};
