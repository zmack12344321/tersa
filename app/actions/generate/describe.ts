'use server';

import { visionModels } from '@/lib/models';
import OpenAI from 'openai';

export const describeAction = async (
  url: string
): Promise<
  | {
      description: string;
    }
  | {
      error: string;
    }
> => {
  try {
    const openai = new OpenAI();

    // TODO: Make this configurable
    const model = visionModels
      .at(0)
      ?.models.find((model) => model.id === 'gpt-4.1-nano')?.id;

    if (!model) {
      throw new Error('No model found');
    }

    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Describe this image.' },
            {
              type: 'image_url',
              image_url: {
                url,
              },
            },
          ],
        },
      ],
    });

    const description = response.choices.at(0)?.message.content;

    if (!description) {
      throw new Error('No description found');
    }

    return {
      description,
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
