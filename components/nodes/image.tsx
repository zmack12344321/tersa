import Image from 'next/image';
import { type ChangeEvent, useCallback } from 'react';
import { Uploader } from '../uploader';
import { NodeLayout } from './layout';

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
    <NodeLayout id={id} data={data} type="Image">
      <div className="p-4">
        {data.src ? (
          <Image src={data.src} alt="Image" width={100} height={100} />
        ) : (
          <Uploader endpoint="/api/image/upload" />
        )}
      </div>
    </NodeLayout>
  );
};
