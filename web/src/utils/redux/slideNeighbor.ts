import { PayloadAction, createSlice, Slice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  limit: 100,
};

export const SearchSlide: Slice<typeof initialState> = createSlice({
  name: 'neighbor',
  initialState: initialState,
  reducers: {
    updateId: (state, action: PayloadAction<string>) => {
      return { ...state, id: action.payload };
    },
    updateLimit: (state, action: PayloadAction<number>) => {
      return { ...state, limit: action.payload };
    },
  },
});

export const { updateId, updateLimit } = SearchSlide.actions;
export const FrameReducer = SearchSlide.reducer;
