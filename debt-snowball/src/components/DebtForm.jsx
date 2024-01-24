// src/components/DebtForm.jsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDebt } from '../redux/actions/debtActions';

function DebtForm() {
    const [creditor, setCreditor] = useState('');
    const [balance, setBalance] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const dispatch = useDispatch();

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
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={creditor} onChange={e => setCreditor(e.target.value)} placeholder="Creditor" />
            <input type="number" value={balance} onChange={e => setBalance(e.target.value)} placeholder="Balance Owed ($)" />
            <input type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} placeholder="Interest Rate (%)" />
            <input type="number" value={paymentAmount} onChange={e => setPaymentAmount(e.target.value)} placeholder="Payment Amount ($)" />
            <button type="submit">Add Debt</button>
        </form>
    );
}

export default DebtForm;
