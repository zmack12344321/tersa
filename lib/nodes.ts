import { describeAction } from '@/app/actions/generate/describe';
import { transcribeAction } from '@/app/actions/generate/transcribe';
import type { AudioNodeProps } from '@/components/nodes/audio';
import type { ImageNodeProps } from '@/components/nodes/image';
import type { TextNodeProps } from '@/components/nodes/text';
import type { Node } from '@xyflow/react';

export const getTextFromTextNodes = (nodes: Node[]) => {
  return nodes
    .filter((node) => node.type === 'text')
    .map((node) => (node.data as TextNodeProps['data']).text)
    .filter(Boolean)
    .join('\n');
};

export const getTranscriptionFromAudioNodes = async (nodes: Node[]) => {
  const urls = nodes
    .filter((node) => node.type === 'audio')
    .map((node) => (node.data as AudioNodeProps['data']).content?.downloadUrl)
    .filter(Boolean) as string[];

  const promises = urls.map(async (url) => {
    const response = await transcribeAction(url);

    if ('error' in response) {
      throw new Error(response.error);
    }

    return response.transcript;
  });

  const transcriptions = await Promise.all(promises);

  return transcriptions.join('\n');
};

export const getDescriptionsFromImageNodes = async (nodes: Node[]) => {
  const urls = nodes
    .filter((node) => node.type === 'image')
    .map((node) => (node.data as ImageNodeProps['data']).content?.downloadUrl)
    .filter(Boolean) as string[];

  const promises = urls.map(async (url) => {
    const response = await describeAction(url);

    if ('error' in response) {
      throw new Error(response.error);
    }

    return response.description;
  });

  const descriptions = await Promise.all(promises);

  return descriptions.join('\n');
};
