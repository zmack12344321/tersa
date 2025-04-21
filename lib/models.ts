import { anthropic } from '@ai-sdk/anthropic';
import { cerebras } from '@ai-sdk/cerebras';
import { deepseek } from '@ai-sdk/deepseek';
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { mistral } from '@ai-sdk/mistral';
import { openai } from '@ai-sdk/openai';
import { xai } from '@ai-sdk/xai';

import {
  AnthropicIcon,
  CerebrasIcon,
  DeepSeekIcon,
  GoogleIcon,
  GroqIcon,
  MistralIcon,
  OpenAiIcon,
  XaiIcon,
} from './icons';

export const chatModels = [
  {
    label: 'OpenAI',
    models: [
      {
        icon: OpenAiIcon,
        id: 'gpt-3.5-turbo',
        label: 'GPT-3.5 Turbo',
        model: openai('gpt-3.5-turbo'),
      },
      { icon: OpenAiIcon, id: 'gpt-4', label: 'GPT-4', model: openai('gpt-4') },
      {
        icon: OpenAiIcon,
        id: 'gpt-4.1',
        label: 'GPT-4.1',
        model: openai('gpt-4.1'),
      },
      {
        icon: OpenAiIcon,
        id: 'gpt-4.1-mini',
        label: 'GPT-4.1 Mini',
        model: openai('gpt-4.1-mini'),
      },
      {
        icon: OpenAiIcon,
        id: 'gpt-4.1-nano',
        label: 'GPT-4.1 Nano',
        model: openai('gpt-4.1-nano'),
      },
      {
        icon: OpenAiIcon,
        id: 'gpt-4o',
        label: 'GPT-4o',
        model: openai('gpt-4o'),
      },
      {
        icon: OpenAiIcon,
        id: 'gpt-4o-mini',
        label: 'GPT-4o Mini',
        model: openai('gpt-4o-mini'),
      },
      { icon: OpenAiIcon, id: 'o1', label: 'O1', model: openai('o1') },
      {
        icon: OpenAiIcon,
        id: 'o1-mini',
        label: 'O1 Mini',
        model: openai('o1-mini'),
      },
      { icon: OpenAiIcon, id: 'o3', label: 'O3', model: openai('o3') },
      {
        icon: OpenAiIcon,
        id: 'o3-mini',
        label: 'O3 Mini',
        model: openai('o3-mini'),
      },
      {
        icon: OpenAiIcon,
        id: 'o4-mini',
        label: 'O4 Mini',
        model: openai('o4-mini'),
      },
    ],
  },

  {
    label: 'xAI',
    models: [
      { icon: XaiIcon, id: 'grok-3', label: 'Grok-3', model: xai('grok-3') },
      {
        icon: XaiIcon,
        id: 'grok-3-fast',
        label: 'Grok-3 Fast',
        model: xai('grok-3-fast'),
      },
      {
        icon: XaiIcon,
        id: 'grok-3-mini',
        label: 'Grok-3 Mini',
        model: xai('grok-3-mini'),
      },
      {
        icon: XaiIcon,
        id: 'grok-3-mini-fast',
        label: 'Grok-3 Mini Fast',
        model: xai('grok-3-mini-fast'),
      },
      {
        icon: XaiIcon,
        id: 'grok-2',
        label: 'Grok-2',
        model: xai('grok-2'),
      },
      {
        icon: XaiIcon,
        id: 'grok-beta',
        label: 'Grok Beta',
        model: xai('grok-beta'),
      },
    ],
  },

  {
    label: 'Anthropic',
    models: [
      {
        icon: AnthropicIcon,
        id: 'claude-3-5-haiku-latest',
        label: 'Claude 3.5 Haiku',
        model: anthropic('claude-3-5-haiku-latest'),
      },
      {
        icon: AnthropicIcon,
        id: 'claude-3-5-sonnet-latest',
        label: 'Claude 3.5 Sonnet',
        model: anthropic('claude-3-5-sonnet-latest'),
      },
      {
        icon: AnthropicIcon,
        id: 'claude-3-7-sonnet-20250219',
        label: 'Claude 3.7 Sonnet',
        model: anthropic('claude-3-7-sonnet-20250219'),
      },
      {
        icon: AnthropicIcon,
        id: 'claude-3-opus-latest',
        label: 'Claude 3 Opus',
        model: anthropic('claude-3-opus-latest'),
      },
    ],
  },

  {
    label: 'Mistral',
    models: [
      {
        icon: MistralIcon,
        id: 'pixtral-large-latest',
        label: 'Pixtral Large',
        model: mistral('pixtral-large-latest'),
      },
      {
        icon: MistralIcon,
        id: 'mistral-large-latest',
        label: 'Mistral Large',
        model: mistral('mistral-large-latest'),
      },
      {
        icon: MistralIcon,
        id: 'mistral-small-latest',
        label: 'Mistral Small',
        model: mistral('mistral-small-latest'),
      },
      {
        icon: MistralIcon,
        id: 'pixtral-12b-2409',
        label: 'Pixtral 12B',
        model: mistral('pixtral-12b-2409'),
      },
    ],
  },

  {
    label: 'Google',
    models: [
      {
        icon: GoogleIcon,
        id: 'gemini-2.0-flash-exp',
        label: 'Gemini 2.0 Flash Exp',
        model: google('gemini-2.0-flash-exp'),
      },
      {
        icon: GoogleIcon,
        id: 'gemini-1.5-flash',
        label: 'Gemini 1.5 Flash',
        model: google('gemini-1.5-flash'),
      },
      {
        icon: GoogleIcon,
        id: 'gemini-1.5-pro',
        label: 'Gemini 1.5 Pro',
        model: google('gemini-1.5-pro'),
      },
    ],
  },

  {
    label: 'DeepSeek',
    models: [
      {
        icon: DeepSeekIcon,
        id: 'deepseek-chat',
        label: 'DeepSeek Chat',
        model: deepseek('deepseek-chat'),
      },
      {
        icon: DeepSeekIcon,
        id: 'deepseek-reasoner',
        label: 'DeepSeek Reasoner',
        model: deepseek('deepseek-reasoner'),
      },
    ],
  },

  {
    label: 'Cerebras',
    models: [
      {
        icon: CerebrasIcon,
        id: 'llama3.1-8b',
        label: 'Llama 3.1 8B',
        model: cerebras('llama3.1-8b'),
      },
      {
        icon: CerebrasIcon,
        id: 'llama3.1-70b',
        label: 'Llama 3.1 70B',
        model: cerebras('llama3.1-70b'),
      },
      {
        icon: CerebrasIcon,
        id: 'llama3.3-70b',
        label: 'Llama 3.3 70B',
        model: cerebras('llama3.3-70b'),
      },
    ],
  },

  {
    label: 'Groq',
    models: [
      {
        icon: GroqIcon,
        id: 'meta-llama/llama-4-scout-17b-16e-instruct',
        label: 'Llama 4 Scout 17B',
        model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
      },
      {
        icon: GroqIcon,
        id: 'llama-3.3-70b-versatile',
        label: 'Llama 3.3 70B Versatile',
        model: groq('llama-3.3-70b-versatile'),
      },
      {
        icon: GroqIcon,
        id: 'llama-3.1-8b-instant',
        label: 'Llama 3.1 8B Instant',
        model: groq('llama-3.1-8b-instant'),
      },
      {
        icon: GroqIcon,
        id: 'mixtral-8x7b-32768',
        label: 'Mixtral 8x7B',
        model: groq('mixtral-8x7b-32768'),
      },
      {
        icon: GroqIcon,
        id: 'gemma2-9b-it',
        label: 'Gemma 2 9B',
        model: groq('gemma2-9b-it'),
      },
    ],
  },
];
