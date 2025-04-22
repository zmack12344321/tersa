import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/kibo-ui/dropzone';
import { upload } from '@vercel/blob/client';

export const Uploader = ({ endpoint }: { endpoint: string }) => {
  const handleDrop = async (files: File[]) => {
    if (!files.length) {
      throw new Error('No file selected');
    }

    const file = files[0];

    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    setBlob(newBlob);
  };

  return (
    <Dropzone
      maxSize={1024 * 1024 * 10}
      minSize={1024}
      maxFiles={1}
      multiple={false}
      accept={{ 'image/*': [] }}
      onDrop={handleDrop}
      src={files}
      onError={console.error}
      className="rounded-none border-none bg-transparent p-0 shadow-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
    >
      <DropzoneEmptyState />
      <DropzoneContent />
    </Dropzone>
  );
};
