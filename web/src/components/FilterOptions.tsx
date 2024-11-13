import React from 'react';

export const FilterOptions = () => (
  <div className="flex space-x-2 mb-4">
    <select className="border rounded p-2">
      <option value={1}>Option 1</option>
      <option value={2}>Option 2</option>
    </select>
    <label className="flex items-center">
      <input type="checkbox" className="mr-2" />
      ClipVideo
    </label>
    <label className="flex items-center">
      <input type="checkbox" className="mr-2" />
      ClipLION
    </label>
    <label className="flex items-center">
      <input type="checkbox" className="mr-2" />
      ClipTIGER
    </label>
  </div>
);
