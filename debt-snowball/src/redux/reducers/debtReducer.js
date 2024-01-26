// src/redux/reducers/debtReducer.js
const initialState = {
    debts: [],
    additionalPayment: 0,
    error: null
};

function debtReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_DEBT':
            return {
                ...state,
                debts: [...state.debts, action.payload]
            };
        case 'DELETE_DEBT':
            return {
                ...state,
                debts: state.debts.filter(debt => debt.id !== action.payload)
            };
        case 'ADD_DEBT_ERROR':
            return {
                ...state,
                error: action.error // Store the error message in the state
            };
        case 'CLEAR_DEBT_ERROR':
            return {
                ...state,
                error: null // Clear the error state
            };
        case 'UPDATE_ADDITIONAL_PAYMENT':
            return {
                ...state,
                additionalPayment: action.payload || 0, // Default to 0 if payload is undefined
            };
        default:
            return state;
    }
}

export default debtReducer;
