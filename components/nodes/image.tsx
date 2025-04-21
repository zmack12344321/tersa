import { Handle, Position } from '@xyflow/react';
import Image from 'next/image';
import { type ChangeEvent, useCallback } from 'react';
import { Uploader } from '../uploader';

export const ImageNode = ({ data }: { data: Record<string, string> }) => {
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="rounded-md border bg-card p-4">
        {data.src ? (
          <Image src={data.src} alt="Image" width={100} height={100} />
        ) : (
          <Uploader endpoint="/api/image/upload" />
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};
