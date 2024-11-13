import { VideoFrame } from '../types/frame';
import { Button, Image, Typography } from 'antd';
import { ImPlay } from 'react-icons/im';
import { FaExpandAlt } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../utils/redux';
import { useInView } from 'react-intersection-observer';
import localforage from 'localforage';
import { useEffect, useState } from 'react';

const { Paragraph } = Typography;

const imageCache = localforage.createInstance({
  name: 'imageCache',
});

const convertToThumbnail = async (url: string, size: number = 400) => {
  const imgId = url.split('/')[url.split('/').length - 2];
  const cacheKey = `${imgId}_${size}`;

  // remove $ at first of imgId
  const convertedId = imgId[0] === '$' ? imgId.slice(1) : imgId;
  try {
    const cachedImage = await imageCache.getItem<Blob>(cacheKey);
    if (cachedImage) {
      return URL.createObjectURL(cachedImage);
    }

    // no-cors mode
    const res = await fetch(
      `https://lh3.googleusercontent.com/d/${convertedId}=s220`,
    );
    console.log(`Fetched image: ${JSON.stringify(res, null, 2)}`);

    // convert image to blob
    const blob = await res.blob();
    if (!blob) {
      throw new Error('Failed to convert image to blob');
    }

    await imageCache.setItem(cacheKey, blob);
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error(`Error fetching image: ${err}`);
    return `https://lh3.googleusercontent.com/d/${convertedId}=s220`;
  }
};

const convertToLargeThumbnail = (url: string) => {
  const imgId = url.split('/')[url.split('/').length - 2];
  // remove $ at first of imgId
  const convertedId = imgId[0] === '$' ? imgId.slice(1) : imgId;
  // https://drive.usercontent.google.com/download?id=1mwHgZVJD0P8BjJLY-ljWTkb0J7vwR1yp&export=view&authuser=0
  return `https://lh3.googleusercontent.com/d/${convertedId}`;
};

const formatFrameId = (id: string) => {
  const [L_num, V_num, F_num] = id.split('_');
  return `${L_num}_${V_num}, ${F_num}`;
};

export const FrameItem: React.FC<{
  frame: VideoFrame;
}> = ({ frame }) => {
  const { id } = useParams<{ id: string }>();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px 0px',
  });

  useEffect(() => {
    if (inView) {
      convertToThumbnail(frame.url).then((url) => setThumbnailUrl(url));
    }
  }, [inView, frame.url]);

  return (
    <div
      ref={ref}
      className={`border rounded-lg min-w-[12rem] max-w-[12rem] h-full ${id === frame.id ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
    >
      <Image
        src={thumbnailUrl as string}
        alt={frame.name}
        className="rounded-t-lg object-contain"
        preview={{
          mask: <FaExpandAlt />,
          src: convertToLargeThumbnail(frame.url),
        }}
        loading="lazy"
        placeholder={<div className="bg-gray-300 w-full h-40 animate-pulse" />}
      />
      <div className="flex justify-center items-center mt-2 font-medium text-center text-xs">
        <span>At {frame.timestamp}s</span> -{' '}
        <span>
          Open in{' '}
          <Button
            type="link"
            className="p-0 !w-fit h-fit text-red-500 hover:!text-red-400 focus:!text-red-700 align-baseline baseline-center"
            icon={<ImPlay />}
            href={`${frame.watch_url}&t=${frame.timestamp}`}
            target="_blank"
          />
        </span>
      </div>

      <div className="bg-slate-200 m-2 px-4 py-1 rounded-md">
        <Paragraph copyable className="flex justify-between !m-0 text-center">
          {formatFrameId(frame.id)}
        </Paragraph>
        <Link
          to={`/neighbor/${frame.id}/20`}
          className="text-blue-500"
          target="_blank"
        >
          More
        </Link>
      </div>
    </div>
  );
};
