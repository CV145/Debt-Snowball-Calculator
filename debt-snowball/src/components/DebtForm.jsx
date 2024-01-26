// src/components/DebtForm.jsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDebt } from '../redux/actions/debtActions';
import './DebtForm.css';
import { clearError } from '../redux/actions/debtActions';

function DebtForm() {
    const [creditor, setCreditor] = useState('');
    const [balance, setBalance] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [additionalAmount, setAdditionalAmount] = useState('');
    const dispatch = useDispatch();
    const error = useSelector(state => state.debts.error); // Access error from the Redux store

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dispatch an action to add a new debt to the store
        dispatch(addDebt({
            creditor,
            balance: parseFloat(balance),
            interestRate: parseFloat(interestRate),
            paymentAmount: parseFloat(paymentAmount)
        }));

        // Clear the form fields
        setCreditor('');
        setBalance('');
        setInterestRate('');
        setPaymentAmount('');

        dispatch(clearError());

    };

    const handleUpdateAdditionalPayment = (value) => {
        const payload = value || 0; // Default to 0 if value is undefined or empty
        dispatch(updateAdditionalPayment(payload));
    };


    // Check if all required fields are filled
    const isFormIncomplete = !creditor || !balance || !interestRate || !paymentAmount;

    return (
        <div>


            <form onSubmit={handleSubmit} className="debt-form">
                <input
                    type="text"
                    className="form-input input-field"
                    value={creditor}
                    onChange={(e) => setCreditor(e.target.value)}
                    placeholder="Creditor"
                />
                <input
                    type="number"
                    className="form-input input-field"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    placeholder="Balance Owed ($)"
                />
                <input
                    type="number"
                    className="form-input input-field"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="Annual Interest Rate (%)"
                />
                <input
                    type="number"
                    className="form-input input-field"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Min. Monthly Pay ($)"
                />
                <button type="button" className="add-debt-button" onClick={handleSubmit} disabled={isFormIncomplete}>
                    Add Debt
                </button>
            </form>
            {error && <p className="error-message">{error}</p>}
            <div className="additional-amount-input">
                Enter a monthly dollar amount you can add to your debt payoff plan:
                <input
                    type="number"
                    className="form-input"
                    value={additionalAmount}
                    onChange={(e) => handleUpdateAdditionalPayment(e.target.value)}
                    placeholder="Extra monthly pay"
                />
            </div>
        </div>
    );
}

export default DebtForm;
