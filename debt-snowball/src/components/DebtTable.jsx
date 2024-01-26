// src/components/DebtTable.jsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteDebt } from '../redux/actions/debtActions';
import './DebtTable.css';

function DebtTable() {
    const debts = useSelector(state => state.debts.debts); // Access the debts from the Redux store
    const dispatch = useDispatch();

    const handleDelete = (id) => {
        console.log('Deleting ID: ' + id);
        dispatch(deleteDebt(id));
    };


    return (
        <div>
            <h1 className="table-header">Debt Avalanche Calculator</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Creditor</th>
                        <th>Balance Owed ($)</th>
                        <th>Annual Interest Rate (%)</th>
                        <th>Min. Monthly Pay ($)</th>
                        <th>Lifetime Interest Cost</th>
                        <th># of Payments Left</th>
                    </tr>
                </thead>
                <tbody>
                    {debts.map((debt, index) => (
                        <tr key={debt.id}>
                            <td>{index + 1}</td>
                            <td>{debt.creditor}</td>
                            <td>{debt.balance ? debt.balance.toFixed(2) : '0.00'}</td>
                            <td>{debt.interestRate ? debt.interestRate.toFixed(2) : '0.00'}</td>
                            <td>{debt.paymentAmount ? debt.paymentAmount.toFixed(2) : '0.00'}</td>
                            {/* Check if interestCost and paymentsLeft are defined before calling toFixed */}
                            <td>{debt.interestCost ? Number(debt.interestCost).toFixed(2) : '0.00'}</td>
                            <td>{debt.paymentsLeft !== undefined ? debt.paymentsLeft : '-'}</td>
                            <td>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(debt.id)}
                                >
                                    X
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DebtTable;
