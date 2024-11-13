import { combineReducers } from '@reduxjs/toolkit';
import { SearchSlide } from './slideSearch';

export const rootReducer = combineReducers({
  search: SearchSlide.reducer,
});
