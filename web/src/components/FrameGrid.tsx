import React from 'react'; // Add this line to import React

import { VideoFrame } from '../types/frame';
import { FrameItem } from './FrameItem';
import { useAppSelector } from '../utils/redux';
import { search } from '../services/api/search';
import { convertFramesToDict, convertResultToFrames } from '../utils/convert';
import { Spin } from 'antd';

export const FrameGrid: React.FC = () => {
  const { query, limit } = useAppSelector((state) => state.search);
  const [frames, setFrames] = React.useState<{
    [key: string]: VideoFrame[];
  }>({});
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const onSearchHandler = async () => {
      if (!query || query.length === 0) return;
      setFrames({});

      setIsLoading(true);
      const result = await search(query, limit);
      const newFrames = convertResultToFrames(result);
      const newFramesDict = convertFramesToDict(newFrames);
      setFrames(newFramesDict);
      setIsLoading(false);
    };
    onSearchHandler();
  }, [query, limit]);

  return (
    // Each video frame array is displayed as a row
    <div className="flex flex-col overflow-x-auto">
      <Spin spinning={isLoading} fullscreen />
      {Object.entries(frames).map(([key, value]) => (
        <div key={key}>
          <div className="flex flex-row items-center gap-4 max-h-80 overflow-auto">
            <span className="font-bold text-sm">{key}</span>
            {value.map((frame) => (
              <FrameItem key={frame.id} frame={frame} />
            ))}
          </div>
          <div className="bg-slate-500 my-1 h-[1px]" />
        </div>
      ))}
    </div>
  );
};
