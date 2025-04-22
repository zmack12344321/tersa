import { type ChangeEvent, useCallback } from 'react';
import { Uploader } from '../uploader';
import { NodeLayout } from './layout';

type VideoNodeProps = {
  data: {
    src?: string;
    width?: number;
    height?: number;
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
          // biome-ignore lint/a11y/useMediaCaption: <explanation>
          <video src={data.src} width={data.width} height={data.height} />
        ) : (
          <Uploader endpoint="/api/video/upload" />
        )}
      </div>
    </NodeLayout>
  );
};
