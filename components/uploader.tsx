import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
  type DropzoneProps,
} from '@/components/ui/kibo-ui/dropzone';
import type { PutBlobResult } from '@vercel/blob';
import { upload } from '@vercel/blob/client';
import Image from 'next/image';
import { useState } from 'react';

type UploaderProps = {
  accept?: DropzoneProps['accept'];
  onUploadCompleted: (blob: PutBlobResult) => void;
};

export const Uploader = ({ onUploadCompleted, accept }: UploaderProps) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = async (files: File[]) => {
    if (!files.length) {
      throw new Error('No file selected');
    }

    setFiles(files);
    const file = files[0];

    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
    });

    onUploadCompleted(newBlob);
  };

  return (
    <Dropzone
      maxSize={1024 * 1024 * 10}
      minSize={1024}
      maxFiles={1}
      multiple={false}
      accept={accept}
      onDrop={handleDrop}
      src={files}
      onError={console.error}
      className="rounded-none border-none bg-transparent p-0 shadow-none hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent"
    >
      <DropzoneEmptyState />
      <DropzoneContent>
        {files && files.length > 0 && (
          <div className="h-[102px] w-full">
            <Image
              src={URL.createObjectURL(files[0])}
              alt="Image preview"
              className="absolute top-0 left-0 h-full w-full object-cover"
              unoptimized
              width={100}
              height={100}
            />
          </div>
        )}
      </DropzoneContent>
    </Dropzone>
  );
};
