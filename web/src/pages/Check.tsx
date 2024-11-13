import { Spin } from 'antd';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FrameItem } from '../components/FrameItem';
import { getByIds } from '../services/api/getImage';
import { convertResultToFrames } from '../utils/convert';
import { VideoFrame } from '../types/frame';

export default function Check() {
  const [imgList, setImgList] = useState<string[]>([]);
  const [frames, setFrames] = useState<VideoFrame[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onCheckHandler = async () => {
    setIsLoading(true);
    const result = await getByIds(imgList);
    const newFrames = convertResultToFrames(result);
    setFrames(newFrames);
    setIsLoading(false);
  };

  return (
    <>
      {/* Navigator */}
      <div className="flex justify-start items-center gap-4 bg-blue-400 px-4 py-2">
        <Link
          to="/"
          className="hover:bg-slate-100 p-2 rounded text-white hover:text-black"
        >
          Home
        </Link>
        <Link to="/check" className="bg-blue-300 p-2 rounded text-white">
          Check
        </Link>
      </div>
      {/* Input field */}
      <div className="flex justify-center h-full">
        <input
          className="flex-1 border-gray-300 mx-2 mt-2 p-2 border rounded-lg"
          type="text"
          onChange={(e) => {
            if (e.target.value === '') return;
            setImgList(e.target.value.split('|'));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onCheckHandler();
            }
          }}
          placeholder="Paste image ids separated by space..."
        />
      </div>
      <div className="mt-4">
        <Spin spinning={isLoading} fullscreen />
        <div className="gap-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7">
          {frames.map((frame) => (
            <FrameItem key={frame.id} frame={frame} />
          ))}
        </div>
      </div>
    </>
  );
}
