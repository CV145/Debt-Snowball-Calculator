//Root reducer, combines all individual reducers

import { combineReducers } from '@reduxjs/toolkit';
import debtReducer from './debtReducer';
// Import other reducers as needed and add them to the combineReducers call

const rootReducer = combineReducers({
  debts: debtReducer,
  // ...other reducers
});

export default rootReducer;

/*
Reducers are pure functions that specify how an 
app's state should change in response to an
action.

Input: previous state and an action
Return: next state

Pure: means they don't modify input arguments and must return new objects

function counterReducer(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state; // If the action is not recognized, return the existing state unchanged
  }
}
*/