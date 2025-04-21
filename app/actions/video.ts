'use server';

export const generateVideoAction = async (prompt: string) => {
  const video = {
    uint8Array: new Uint8Array(),
    mimeType: 'video/mp4',
  };

  const result = await new Promise((resolve) => {
    setTimeout(() => {
      resolve(video.uint8Array);
    }, 1000);
  });

  return result;
};
