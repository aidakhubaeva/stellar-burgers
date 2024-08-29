import { combineReducers } from '@reduxjs/toolkit';
import burgerReducer from '../slices/burgerSlice';

const rootReducer = combineReducers({
  burger: burgerReducer
});

export default rootReducer;
