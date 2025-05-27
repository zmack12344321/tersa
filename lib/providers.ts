import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createCohere } from '@ai-sdk/cohere';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { createHume } from '@ai-sdk/hume';
import { createLMNT } from '@ai-sdk/lmnt';
import { createMistral } from '@ai-sdk/mistral';
import { createOpenAI } from '@ai-sdk/openai';
import { createXai } from '@ai-sdk/xai';
import { env } from './env';

export const anthropic = createAnthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export const cohere = createCohere({
  apiKey: env.COHERE_API_KEY,
});

export const deepseek = createDeepSeek({
  apiKey: env.DEEPSEEK_API_KEY,
});

export const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const groq = createGroq({
  apiKey: env.GROQ_API_KEY,
});

export const mistral = createMistral({
  apiKey: env.MISTRAL_API_KEY,
});

export const openai = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const xai = createXai({
  apiKey: env.XAI_API_KEY,
});

export const bedrock = createAmazonBedrock({
  region: env.AWS_REGION,
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
});

export const hume = createHume({
  apiKey: env.HUME_API_KEY,
});

export const lmnt = createLMNT({
  apiKey: env.LMNT_API_KEY,
});
