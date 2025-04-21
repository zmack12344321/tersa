import { type ChangeEvent, useCallback } from 'react';
import { Uploader } from '../uploader';
import { NodeLayout } from './layout';

type VideoNodeProps = {
  data: {
    src?: string;
  };
  id: string;
};

export const VideoNode = ({ data, id }: VideoNodeProps) => {
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <NodeLayout id={id} data={data} type="Video">
      <div className="p-4">
        {data.src ? (
          <video src={data.src} alt="Video" width={100} height={100} />
        ) : (
          <Uploader endpoint="/api/video/upload" />
        )}
      </div>
    </NodeLayout>
  );
};
