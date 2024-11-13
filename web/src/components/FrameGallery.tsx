import { FC, useEffect, useState } from 'react';

import { VideoFrame } from '../types/frame';
import { FrameItem } from './FrameItem';
import { useNavigate, useParams } from 'react-router-dom';
import { neighborSearch } from '../services/api/search';
import { convertResultToFrames } from '../utils/convert';
import { Spin } from 'antd';

export interface FrameGalleryProps {
  // dictionary of video frames
  frames: VideoFrame[];
}

export const FrameGallery: FC = () => {
  // get params from url by react-router-dom
  const { id, limit } = useParams<{ id: string; limit: string }>();
  const navigate = useNavigate();
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    // log the id and limit
    const onSearchNeighborHandler = async () => {
      setFrames([]);
      setIsLoading(true);
      const result = await neighborSearch(
        id as string,
        limit ? parseInt(limit) : 20,
      );
      const newFrames = convertResultToFrames(result);
      setFrames(newFrames);
      setIsLoading(false);
    };

    onSearchNeighborHandler();
  }, [id, limit]);

  return (
    <>
      <Spin spinning={isLoading} fullscreen />
      <div className="gap-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7">
        {frames.map((frame) => (
          <FrameItem key={frame.id} frame={frame} />
        ))}
      </div>
    </>
  );
};
