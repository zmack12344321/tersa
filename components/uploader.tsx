import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/kibo-ui/dropzone';
import { useState } from 'react';

export const Uploader = ({ endpoint }: { endpoint: string }) => {
  const [files, setFiles] = useState<File[] | undefined>();

  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  return (
    <Dropzone
      maxSize={1024 * 1024 * 10}
      minSize={1024}
      maxFiles={10}
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
