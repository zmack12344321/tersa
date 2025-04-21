import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const modelMap = {
  'gpt-3.5-turbo': openai('gpt-3.5-turbo'),
  'gpt-4': openai('gpt-4'),
  'gpt-4.1': openai('gpt-4.1'),
  'gpt-4.1-mini': openai('gpt-4.1-mini'),
  'gpt-4.1-nano': openai('gpt-4.1-nano'),
  'gpt-4o': openai('gpt-4o'),
  'gpt-4o-mini': openai('gpt-4o-mini'),
  o1: openai('o1'),
  'o1-mini': openai('o1-mini'),
  o3: openai('o3'),
  'o3-mini': openai('o3-mini'),
  'o4-mini': openai('o4-mini'),
};

export const POST = async (req: Request) => {
  const { messages, model } = await req.json();

  if (typeof model !== 'string') {
    return new Response('Model must be a string', { status: 400 });
  }

  if (!(model in modelMap)) {
    return new Response('Invalid model', { status: 400 });
  }

  const result = streamText({
    model: modelMap[model as keyof typeof modelMap],
    system:
      'You are a helpful assistant. Keep your responses concise and to the point, preferably less than 100 words.',
    messages,
  });

  return result.toDataStreamResponse();
};
