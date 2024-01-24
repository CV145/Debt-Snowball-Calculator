// src/redux/actions/debtActions.js
import { v4 as uuidv4 } from 'uuid';

export const addDebt = (debt) => ({
    type: 'ADD_DEBT',
    payload: {
        ...debt,
        id: uuidv4() // Generate a unique ID for each debt
    }
});

export const deleteDebt = id => ({
    type: 'DELETE_DEBT',
    payload: id
});