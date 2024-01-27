import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './PaymentSchedule.css'; // Make sure to create this CSS file for styling

function PaymentSchedule() {
    // Initialize paymentSchedule state 
    const [paymentSchedule, setPaymentSchedule] = useState([]);
    const debts = useSelector(state => state.debts.debts); // Retrieve your debts from the state
    const additionalPayment = useSelector(state => state.additionalPayment) || 0; // Retrieve any additional payment amount

    //The generatePaymentSchedule function will generate an array of arrays, where each sub-array represents the payments for a particular month across all debts.
    function generatePaymentSchedule(debts, additionalPayment) {
        let debtsProgress = debts.map(debt => ({
            ...debt,
            remainingBalance: debt.balance
        })).sort((a, b) => b.interestRate - a.interestRate);

        let paymentSchedule = [];
        let month = 0;

        //Monthly budget
        let totalMonthlyBudget = debts.reduce((acc, debt) => acc + debt.paymentAmount, 0) + additionalPayment;


        //Keep looping as long as there exist unpaid debts
        while (debtsProgress.some(debt => debt.remainingBalance > 0)) {
            //The payments to make this month, one for each debt
            let monthlyPayments = new Array(debtsProgress.length).fill(0);

            let budgetUsed = 0;

            debtsProgress.forEach((debt, index) => {
                if (debt.remainingBalance > 0) {
                    let interestPayment = debt.remainingBalance * (debt.interestRate / 100 / 12);
                    let payment = Math.min(debt.remainingBalance + interestPayment, debt.paymentAmount);
                    monthlyPayments[index] = payment.toFixed(2);
                    debt.remainingBalance -= (payment - interestPayment);
                    budgetUsed += payment; // Track budget used
                } else {
                    monthlyPayments[index] = '0.00';
                }
            });

            // Calculate leftover funds after initial payments
            let leftoverFunds = totalMonthlyBudget - budgetUsed;

            // Redistribute leftover funds while ensuring the total payments don't exceed the budget
            for (let i = 0; i < debtsProgress.length; i++) {
                let debt = debtsProgress[i];
                if (leftoverFunds > 0 && debt.remainingBalance > 0) {
                    let paymentTowardsDebt = Math.min(leftoverFunds, debt.remainingBalance);
                    monthlyPayments[i] = (parseFloat(monthlyPayments[i]) + paymentTowardsDebt).toFixed(2);
                    debt.remainingBalance -= paymentTowardsDebt;
                    leftoverFunds -= paymentTowardsDebt;
                    budgetUsed += paymentTowardsDebt;

                    // Stop redistribution if the total budget is reached
                    if (budgetUsed >= totalMonthlyBudget) {
                        break;
                    }
                }
            }

            paymentSchedule.push(monthlyPayments);
            month++;
        }

        return paymentSchedule;
    }









    // Effect to calculate payment schedule when debts or additionalPayment change
    useEffect(() => {
        console.log('useEffect is running');
        console.log('Current debts:', debts);
        console.log('Current additionalPayment:', additionalPayment);

        const newPaymentSchedule = generatePaymentSchedule(debts, additionalPayment);
        console.log('New Payment Schedule:', newPaymentSchedule);
        setPaymentSchedule(newPaymentSchedule);

    }, [debts, additionalPayment]);

    // Dependencies array to determine when the effect should run - the effect will re-run only when one of the dependencies has changed since the last render, an empty array [] means it will only run once


    if (paymentSchedule.length === 0) {
        console.log('Payment schedule is empty');
        return <div>No payment schedule available.</div>;
    }

    return (
        <div className="payment-schedule">
            <h2>Accelerated Debt-Payoff Plan Payment Schedule</h2>
            <table>
                <thead>
                    <tr>
                        <th>Pmt#</th>
                        {console.log('Debts:', debts)}
                        {debts.map((_, index) => (
                            <th key={index}>{index + 1}</th> // Column headers for each debt
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paymentSchedule.map((monthlyPayments, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            {monthlyPayments.map((payment, debtIndex) => (
                                <td key={debtIndex}>
                                    {payment}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PaymentSchedule;
