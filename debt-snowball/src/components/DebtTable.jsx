// src/components/DebtTable.jsx

import React from 'react';
import { useSelector } from 'react-redux';

function DebtTable() {
    const debts = useSelector(state => state.debts.debts); // Access the debts from the Redux store

    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Creditor</th>
                    <th>Balance Owed ($)</th>
                    <th>Interest Rate (%)</th>
                    <th>Payment Amount ($)</th>
                    <th>Interest Cost</th>
                    <th># of Payments Left</th>
                </tr>
            </thead>
            <tbody>
                {debts.map((debt, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{debt.creditor}</td>
                        <td>{debt.balance ? debt.balance.toFixed(2) : '0.00'}</td>
                        <td>{debt.interestRate ? debt.interestRate.toFixed(2) : '0.00'}</td>
                        <td>{debt.paymentAmount ? debt.paymentAmount.toFixed(2) : '0.00'}</td>
                        {/* Check if interestCost and paymentsLeft are defined before calling toFixed */}
                        <td>{debt.interestCost ? debt.interestCost.toFixed(2) : '0.00'}</td>
                        <td>{debt.paymentsLeft !== undefined ? debt.paymentsLeft : '-'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DebtTable;
