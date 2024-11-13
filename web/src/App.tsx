import { useState } from 'react';
import { SearchBar } from './components';
import { FilterOptions } from './components/FilterOptions';
import DraggableObjectGrid from './components/DraggableObjectGrid';
import 'leaflet/dist/leaflet.css';
import { InputNumber } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './utils/redux';
import { updateLimit } from './utils/redux/slideSearch';
function App() {
  const dispatch = useAppDispatch();
  const { limit } = useAppSelector((state) => state.search);
  const [totalFrames, setTotalFrames] = useState(0);

  return (
    <>
      {/* Navigator */}
      <div className="flex justify-start items-center gap-4 bg-blue-400 px-4 py-2">
        <Link to="/" className="bg-blue-300 p-2 rounded text-white">
          Home
        </Link>
        <Link
          to="/check"
          className="hover:bg-slate-100 p-2 rounded text-white hover:text-black"
        >
          Check
        </Link>
      </div>
      <div className="relative mx-auto p-4">
        <div className="flex justify-between items-center gap-4">
          <h1 className="mb-4 font-bold text-2xl text-pretty">AIO_Chef</h1>
          <SearchBar />
        </div>
        <FilterOptions />
        <div className="flex items-center gap-4 mb-4">
          <label className="text-gray-500 text-sm">Frame Returns:</label>
          <InputNumber
            className="w-20"
            placeholder="Limit"
            min={1}
            max={100000}
            defaultValue={limit}
            onBlur={(e) => {
              dispatch(updateLimit(Number(e.target.value)));
            }}
          />
        </div>
        <div className="flex gap-4">
          <div className="w-[310px] overflow-hidden">
            <DraggableObjectGrid />
          </div>
          <div className="w-full overflow-auto">
            <Outlet />
          </div>
        </div>

        <div className="top-14 right-2 absolute bg-gray-100 p-2 rounded-full text-gray-500 text-sm">
          Total Frames: {totalFrames}
        </div>
      </div>
    </>
  );
}

export default App;
