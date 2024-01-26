// src/redux/actions/debtActions.js
import { v4 as uuidv4 } from 'uuid';

export const addDebt = (debt) => {
    const debtInfo = calculateDebtInfo(debt.balance, debt.interestRate, debt.paymentAmount);

    if (debtInfo.error) {
        // Handle the error, such as showing an error message to the user
        return {
            type: 'ADD_DEBT_ERROR',
            error: debtInfo.error
        };
    } else {
        return {
            type: 'ADD_DEBT',
            payload: {
                ...debt,
                id: uuidv4(),
                interestCost: debtInfo.totalInterestCost, // This should be a number now
                paymentsLeft: debtInfo.paymentsLeft
            }
        };
    }
};
export const deleteDebt = id => ({
    type: 'DELETE_DEBT',
    payload: id
});

export const clearError = () => ({
    type: 'CLEAR_DEBT_ERROR'
});

export const updateAdditionalPayment = (amount) => ({
    type: 'UPDATE_ADDITIONAL_PAYMENT',
    payload: amount,
});


function calculateDebtInfo(balance, annualInterestRate, paymentAmount) {
    if (paymentAmount <= 0) {
        return { error: "Payment amount must be greater than zero." };
    }

    const monthlyInterestRate = annualInterestRate / 100 / 12;
    let balanceRemaining = balance;
    let totalInterestPaid = 0;
    let paymentsLeft = 0;

    // Check if payment covers at least the first month's interest
    let monthlyInterest = balanceRemaining * monthlyInterestRate;
    if (paymentAmount <= monthlyInterest) {
        return { error: "Payment amount is too low to cover the interest." };
    }

    // Calculate the number of payments and total interest
    while (balanceRemaining > 0) {
        monthlyInterest = balanceRemaining * monthlyInterestRate;
        let principalPayment = paymentAmount - monthlyInterest;
        balanceRemaining -= principalPayment;
        totalInterestPaid += monthlyInterest;
        paymentsLeft++;

        // Prevent infinite loops
        if (paymentsLeft > 1000) {
            return { error: "Number of payments is too high, please check your input values." };
        }
    }

    // Ensure the values are numbers and not NaN or Infinity
    if (!isFinite(totalInterestPaid) || !isFinite(paymentsLeft)) {
        return { error: "Invalid calculation results. Please check your input values." };
    }

    return {
        totalInterestCost: parseFloat(totalInterestPaid.toFixed(2)),
        paymentsLeft
    };
}


