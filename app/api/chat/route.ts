import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('o3-mini'),
    system:
      'You are a helpful assistant. Keep your responses concise and to the point, preferably less than 100 words.',
    messages,
  });

  return result.toDataStreamResponse();
};
