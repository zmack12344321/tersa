import { Handle, Position } from '@xyflow/react';
import Image from 'next/image';
import { type ChangeEvent, useCallback } from 'react';
import { Uploader } from '../uploader';

type ImageNodeProps = {
  data: {
    src?: string;
  };
  id: string;
};

export const ImageNode = ({ data, id }: ImageNodeProps) => {
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="divide-y">
        {process.env.NODE_ENV === 'development' && (
          <p className="rounded-t-lg bg-secondary px-4 py-3 font-mono text-muted-foreground text-xs">
            {id}
          </p>
        )}
        <div className="p-4">
          {data.src ? (
            <Image src={data.src} alt="Image" width={100} height={100} />
          ) : (
            <Uploader endpoint="/api/image/upload" />
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
};
