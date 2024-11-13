import { useCallback, useEffect, useState } from 'react';
import { RadioOption } from './RadioOptions';
import { Divider, InputNumber, Modal, Select } from 'antd';
import { useAppDispatch } from '../utils/redux';
import { updateQuery } from '../utils/redux/slideSearch';
import { useNavigate } from 'react-router-dom';

const SCOPE_OPTIONS = [
  {
    value: 'all',
    label: 'All Screens',
    description: 'Keyframes from all videos',
  },
  {
    value: 'video',
    label: 'Specific Video',
    description: 'Keyframes from a video',
  },
  {
    value: 'range',
    label: 'Range of Video pack',
    description: 'Keyframes from a range of videos pack',
  },
];

const ScopeSelection = ({
  scope,
  setScope,
}: {
  scope: string;
  setScope: any;
}) => (
  <div className="flex flex-col flex-1 justify-between gap-2">
    <label htmlFor="scope-all" className="text-gray-500 text-sm">
      Searching scope:
    </label>
    <div className="flex flex-col justify-center gap-2">
      {SCOPE_OPTIONS.map(({ value, label, description }) => (
        <RadioOption
          key={value}
          id={value}
          label={label}
          description={description}
          checked={scope === value}
          onChange={() => setScope(value)}
        />
      ))}
    </div>
  </div>
);

const PackSelection = ({ type }: { type: 'start' | 'end' }) => (
  <div className="flex flex-col">
    <label htmlFor={`pack-${type}`} className="text-gray-500 text-sm">
      Video Pack {type === 'end' ? 'To' : 'From'}:{' '}
    </label>
    <Select id={`pack-${type}`} className="flex-1 border-0">
      {Array.from({ length: 5 }, (_, i) => (
        <Select.Option key={`L${i + 1}`} value={`L${i + 1}`}>
          L{i + 1}
        </Select.Option>
      ))}
    </Select>
  </div>
);

const VideoSelection = () => (
  <>
    <PackSelection type="start" />
    <div className="flex flex-col">
      <label htmlFor="video-select" className="text-gray-500 text-sm">
        Video:
      </label>
      <Select id="video-select" className="flex-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Select.Option key={`V${i + 1}`} value={`V${i + 1}`}>
            V{i + 1}
          </Select.Option>
        ))}
      </Select>
    </div>
  </>
);

export const SearchBar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [scope, setScope] = useState<'all' | 'video' | 'range'>('all');
  const [keyframeNumber, setKeyframeNumber] = useState<number | undefined>();

  const onSearch = useCallback(
    (search: string, keyframeNumber?: number) => {
      dispatch(updateQuery({ query: search, limit: keyframeNumber }));
      // navigate to main page
      navigate('/');
    },
    [dispatch, navigate],
  );

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        setShowSettings(true);
      }
      if (e.key === 'Escape') {
        setShowSettings(false);
      }
      if (e.key === 'Enter') {
        console.log('Enter pressed', showSettings);
        if (showSettings) {
          console.log('Searching with settings');
          onSearch(search, keyframeNumber);
        }
      }
    };

    window.addEventListener('keydown', keyHandler);
    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [search, keyframeNumber, showSettings, onSearch]);

  return (
    <>
      <Modal
        open={showSettings}
        onOk={() => setShowSettings(false)}
        onCancel={() => setShowSettings(false)}
        footer={
          <div>
            <kbd className="px-2 py-1 border border-solid rounded-full font-bold text-xs">
              Enter
            </kbd>{' '}
            to search
            <span className="mx-2">|</span>
            <kbd className="px-2 py-1 border border-solid rounded-full font-bold text-xs">
              Esc
            </kbd>
            &nbsp;to close
          </div>
        }
        width={800}
      >
        <input
          type="text"
          placeholder="Search..."
          className="border-0 p-0 rounded-lg hover:ring-0 focus:ring-0 w-full text-sm focus:outline-none"
        />
        <Divider className="my-2 text-slate-900" />
        <div className="flex text-gray-700 text-sm">
          <ScopeSelection scope={scope} setScope={setScope} />
          <div className="flex flex-col flex-1">
            {scope === 'video' && <VideoSelection />}
            {scope === 'range' && (
              <>
                <PackSelection type="start" />
                <PackSelection type="end" />
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col mt-8">
          <label htmlFor="keyframe-number" className="text-gray-500 text-sm">
            The number of return keyframes:
          </label>
          <InputNumber
            className="mt-2 w-full"
            placeholder="Keyframe number"
            value={keyframeNumber}
            min={0}
            max={9999}
            defaultValue={0}
            onChange={(value) => {
              setKeyframeNumber(value as number);
            }}
          />
          <sub className="text-gray-500 text-xs">
            If the value is empty, all keyframes will be returned.
          </sub>
        </div>
      </Modal>
      <div className="flex flex-1 justify-center items-center bg-slate-200 mb-4 p-1 border focus-within:border-blue-500 rounded-2xl group">
        <div className="group-focus-within:text-blue-500 ml-1 p-1 rounded-lg active:text-blue-900">
          <i className="fa-search fas"></i>
        </div>
        <input
          type="search"
          placeholder="Describe the screen..."
          className="flex-1 bg-slate-200 p-1 border-none group-focus:border-none rounded-3xl focus:ring-0 outline-none focus:outline-none"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSearch(search);
            }
          }}
          // search on mobile keyboard enter
        />
        {/* Crtl K indicator */}
        <div className="sm:flex border-1 hidden bg-slate-50 mr-2 p-1 border-solid rounded-lg text-gray-500 text-xs">
          <kbd className="font-bold text-xs">^</kbd>
          <kbd className="font-bold text-xs">K</kbd>
        </div>
      </div>
    </>
  );
};
