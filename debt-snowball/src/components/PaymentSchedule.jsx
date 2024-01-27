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

        while (debtsProgress.some(debt => debt.remainingBalance > 0)) {
            let monthlyPayments = new Array(debtsProgress.length).fill(0);
            let leftoverFunds = additionalPayment;

            debtsProgress.forEach((debt, index) => {
                let interestPayment = debt.remainingBalance * (debt.interestRate / 100 / 12); // Monthly interest
                let paymentTowardsPrincipal = debt.paymentAmount - interestPayment; // Payment towards principal

                if (paymentTowardsPrincipal < 0) {
                    paymentTowardsPrincipal = 0; // If the interest is greater than the payment, nothing goes to the principal
                }

                if (index === 0) { // Highest interest rate debt gets additional payment
                    paymentTowardsPrincipal += leftoverFunds;
                    leftoverFunds = 0; // Reset leftover funds
                }

                let totalPayment = paymentTowardsPrincipal + interestPayment;

                if (totalPayment >= debt.remainingBalance + interestPayment) {
                    leftoverFunds = totalPayment - debt.remainingBalance - interestPayment; // Any excess is leftover funds
                    monthlyPayments[index] = (debt.remainingBalance + interestPayment).toFixed(2); // Pay off the debt including interest
                    debt.remainingBalance = 0; // Debt is now paid off
                } else {
                    monthlyPayments[index] = totalPayment.toFixed(2); // Make a regular payment
                    debt.remainingBalance -= paymentTowardsPrincipal; // Subtract payment from remaining balance
                }
            });

            // After handling payments, distribute any leftover funds to the next highest interest debt
            let i = 0;
            while (leftoverFunds > 0 && i < debtsProgress.length) {
                let debt = debtsProgress[i];
                if (debt.remainingBalance > 0) {
                    let additionalPaymentToDebt = Math.min(leftoverFunds, debt.remainingBalance);
                    debt.remainingBalance -= additionalPaymentToDebt;
                    monthlyPayments[i] = (parseFloat(monthlyPayments[i]) + additionalPaymentToDebt).toFixed(2);
                    leftoverFunds -= additionalPaymentToDebt;
                }
                i++;
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
