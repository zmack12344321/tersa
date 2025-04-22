import { type ChangeEvent, useCallback } from 'react';
import { Uploader } from '../uploader';
import { NodeLayout } from './layout';

type AudioNodeProps = {
  data: {
    src?: string;
  };
  id: string;
};

export const AudioNode = ({ data, id }: AudioNodeProps) => {
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  return (
    <NodeLayout id={id} data={data} type="Audio">
      <div className="p-4">
        {data.src ? (
          // biome-ignore lint/a11y/useMediaCaption: <explanation>
          <audio src={data.src} controls />
        ) : (
          <Uploader endpoint="/api/audio/upload" />
        )}
      </div>
    </NodeLayout>
  );
};
