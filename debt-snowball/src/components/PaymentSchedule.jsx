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
        // Clone the debts array to avoid mutating the original data
        let debtsProgress = debts.map(debt => ({
            ...debt,
            paidOff: false,
            remainingBalance: debt.balance + debt.interestCost
        })).sort((a, b) => b.interestRate - a.interestRate);

        let paymentSchedule = [];
        let month = 0;

        // Function to find the next debt that is not paid off
        const findNextDebtIndex = (fromIndex) => {
            return debtsProgress.findIndex((debt, index) => index >= fromIndex && !debt.paidOff);
        };

        // Continue looping until all debts are paid off
        while (debtsProgress.some(debt => !debt.paidOff)) {

            //This month's payments
            let monthlyPayments = [];

            //Leftover funds rolled over to the debt with the next highest interest rate
            let leftoverFunds = additionalPayment;


            //Calculate the payment to make for each debt
            debtsProgress.forEach((debt, index) => {
                if (debt.paidOff) {
                    monthlyPayments[index] = '0.00'; // No payment needed for paid off debt
                    leftoverFunds += debt.paymentAmount; // Add its payment amount to leftover funds
                    return;
                }

                let payment = debt.paymentAmount;
                if (index === 0) { // Highest interest rate debt gets additional payment
                    payment += leftoverFunds;
                    leftoverFunds = 0; // Reset leftover funds
                }

                if (payment >= debt.remainingBalance) {
                    leftoverFunds = payment - debt.remainingBalance; // Any excess is leftover funds
                    monthlyPayments[index] = debt.remainingBalance.toFixed(2); // Pay off the debt
                    debt.remainingBalance = 0; // Debt is now paid off
                    debt.paidOff = true;
                } else {
                    monthlyPayments[index] = payment.toFixed(2); // Make a regular payment
                    debt.remainingBalance -= payment; // Subtract payment from remaining balance
                }
            });

            // After handling payments, distribute any leftover funds to the next highest interest debt
            let i = 0;
            while (leftoverFunds > 0 && i < debtsProgress.length) {
                let debt = debtsProgress[i];
                if (!debt.paidOff) {
                    let additionalPaymentToDebt = Math.min(leftoverFunds, debt.remainingBalance);
                    debt.remainingBalance -= additionalPaymentToDebt;
                    monthlyPayments[i] = (parseFloat(monthlyPayments[i]) + additionalPaymentToDebt).toFixed(2);
                    leftoverFunds -= additionalPaymentToDebt;
                    if (debt.remainingBalance === 0) {
                        debt.paidOff = true;
                    }
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
