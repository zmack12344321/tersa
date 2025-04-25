import { chatModels } from '@/lib/models';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const POST = async (req: Request) => {
  const { messages, modelId } = await req.json();

  if (typeof modelId !== 'string') {
    return new Response('Model must be a string', { status: 400 });
  }

  const model = chatModels
    .flatMap((m) => m.models)
    .find((m) => m.id === modelId);

  if (!model) {
    return new Response('Invalid model', { status: 400 });
  }

  const result = streamText({
    model: model.model,
    system: [
      "You are a helpful assistant that generates content based on the user's prompts.",
      'The user will provide instructions; and may provide text, audio transcriptions, or images as context.',
    ].join('\n'),
    messages,
  });

  return result.toDataStreamResponse();
};
