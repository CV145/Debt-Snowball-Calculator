//Holds the whole state tree of the application

// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const preloadedState = loadState();
console.log('Loaded state:', preloadedState);
const store = configureStore({
    reducer: rootReducer,
    preloadedState
});

// Function to load the state
function loadState() {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined; // No state in localStorage, return undefined to use initial state
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
}

// Function to save the state
function saveState(state) {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch (err) {
        // Ignore write errors.
    }
}

store.subscribe(() => {
    console.log('Saving state:', store.getState());
    saveState({
        debts: store.getState().debts // Persist only the debts part of the state
    });
});

export default store;
