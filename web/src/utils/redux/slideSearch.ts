import { PayloadAction, createSlice, Slice } from '@reduxjs/toolkit';

const initialState = {
  query: '',
  limit: 10,
};

export const SearchSlide: Slice<typeof initialState> = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {
    updateQuery: (
      state,
      action: PayloadAction<{ query: string; limit?: number }>,
    ) => {
      // update only identified fields
      return {
        ...state,
        query: action.payload.query,
        limit: action.payload.limit ?? state.limit,
      };
    },

    updateLimit: (state, action: PayloadAction<number>) => {
      console.log('action.payload', action.payload);
      return { ...state, limit: action.payload };
    },
  },
});

export const { updateQuery, updateLimit } = SearchSlide.actions;
export const SearchReducer = SearchSlide.reducer;
