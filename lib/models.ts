import { openai } from '@ai-sdk/openai';
import { SiOpenai } from '@icons-pack/react-simple-icons';

export const chatModels = [
  {
    icon: SiOpenai,
    id: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    model: openai('gpt-3.5-turbo'),
  },
  { icon: SiOpenai, id: 'gpt-4', label: 'GPT-4', model: openai('gpt-4') },
  { icon: SiOpenai, id: 'gpt-4.1', label: 'GPT-4.1', model: openai('gpt-4.1') },
  {
    icon: SiOpenai,
    id: 'gpt-4.1-mini',
    label: 'GPT-4.1 Mini',
    model: openai('gpt-4.1-mini'),
  },
  {
    icon: SiOpenai,
    id: 'gpt-4.1-nano',
    label: 'GPT-4.1 Nano',
    model: openai('gpt-4.1-nano'),
  },
  { icon: SiOpenai, id: 'gpt-4o', label: 'GPT-4o', model: openai('gpt-4o') },
  {
    icon: SiOpenai,
    id: 'gpt-4o-mini',
    label: 'GPT-4o Mini',
    model: openai('gpt-4o-mini'),
  },
  { icon: SiOpenai, id: 'o1', label: 'O1', model: openai('o1') },
  { icon: SiOpenai, id: 'o1-mini', label: 'O1 Mini', model: openai('o1-mini') },
  { icon: SiOpenai, id: 'o3', label: 'O3', model: openai('o3') },
  { icon: SiOpenai, id: 'o3-mini', label: 'O3 Mini', model: openai('o3-mini') },
  { icon: SiOpenai, id: 'o4-mini', label: 'O4 Mini', model: openai('o4-mini') },
];
