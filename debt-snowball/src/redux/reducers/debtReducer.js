// src/redux/reducers/debtReducer.js
const initialState = {
    debts: []
};

function debtReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_DEBT':
            return {
                ...state,
                debts: [...state.debts, action.payload]
            };
        // ... other action handlers
        default:
            return state;
    }
}

export default debtReducer;
