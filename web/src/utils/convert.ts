import { VideoFrame } from '../types/frame';
export const convertResultToFrames = (result: {
  frames: {
    image_id: string;
    link: string;
    frame_stamp: number;
    watch_url: string;
    google_drive_link?: string;
  }[];
}) => {
  return result.frames.map(
    (frame: {
      image_id: string;
      link: string;
      frame_stamp: number;
      watch_url: string;
      google_drive_link?: string;
    }) => ({
      id: frame.image_id,
      url: frame.link ?? frame['google_drive_link'],
      name: frame.image_id,
      timestamp: Math.floor(frame.frame_stamp),
      watch_url: frame.watch_url,
    }),
  ) as VideoFrame[];
};

export const convertFramesToDict = (frames: VideoFrame[]) => {
  return frames.reduce(
    (acc: { [key: string]: VideoFrame[] }, frame: VideoFrame) => {
      const frame_names = frame.name.split('_');
      const [L_num, V_num] = frame_names;
      const key = `${L_num}_${V_num}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(frame);
      return acc;
    },
    {} as { [key: string]: VideoFrame[] },
  );
};
