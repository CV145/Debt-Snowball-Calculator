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
        let debtsProgress = debts.map((debt, index) => ({
            ...debt,
            remainingBalance: debt.balance,
            originalIndex: index
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

            // Loop through each debt to make payments
            debtsProgress.forEach((debt, index) => {
                if (debt.remainingBalance > 0) {
                    // Calculate the interest for the current period
                    let interestPayment = debt.remainingBalance * (debt.interestRate / 100 / 12);
                    // Determine the payment amount, ensuring we do not overpay the debt
                    let payment = Math.min(debt.remainingBalance + interestPayment, debt.paymentAmount);
                    // If the payment is greater than the remaining balance, adjust it to be the exact payoff amount
                    if (payment > debt.remainingBalance) {
                        payment = debt.remainingBalance;
                    }
                    // Apply the payment to the debt, subtracting the interest to reduce the principal
                    debt.remainingBalance -= (payment - interestPayment);
                    // Update the budget used with the actual payment amount
                    budgetUsed += payment;
                    // Set the payment in the monthlyPayments array using the original index of the debt
                    monthlyPayments[debt.originalIndex] = payment.toFixed(2);
                } else {
                    // If the debt is already paid off, set its payment to 0.00
                    monthlyPayments[debt.originalIndex] = '0.00';
                }
            });

            // Calculate leftover funds after initial payments
            let leftoverFunds = totalMonthlyBudget - budgetUsed;

            // Redistribute leftover funds to debts with the highest interest rate first
            // Redistribute leftover funds while ensuring the total payments don't exceed the budget
            debtsProgress.forEach((debt, index) => {
                if (leftoverFunds <= 0) return;

                if (debt.remainingBalance > 0) {
                    // Check if we can pay off this debt with the current leftover funds
                    let paymentTowardsDebt = Math.min(leftoverFunds, debt.remainingBalance);
                    // If the payment is less than a dollar but not enough to clear the debt, skip to the next iteration
                    if (paymentTowardsDebt < 1 && paymentTowardsDebt != debt.remainingBalance) {
                        return;
                    }

                    monthlyPayments[debt.originalIndex] = (parseFloat(monthlyPayments[debt.originalIndex]) + paymentTowardsDebt).toFixed(2);
                    debt.remainingBalance -= paymentTowardsDebt;
                    leftoverFunds -= paymentTowardsDebt;
                    budgetUsed += paymentTowardsDebt;

                    console.log(`Allocated ${paymentTowardsDebt.toFixed(2)} to Debt #${debt.originalIndex}, Remaining Balance: ${debt.remainingBalance.toFixed(2)}`);
                }
            });

            // Handle any final small payments that are less than a dollar but are the exact remaining balance of a debt
            debtsProgress.forEach((debt, index) => {
                if (debt.remainingBalance > 0 && debt.remainingBalance < 1) {
                    monthlyPayments[debt.originalIndex] = (parseFloat(monthlyPayments[debt.originalIndex]) + debt.remainingBalance).toFixed(2);
                    console.log(`Final small payment of ${debt.remainingBalance.toFixed(2)} made to Debt #${debt.originalIndex}`);
                    debt.remainingBalance = 0;
                }
            });



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
                        {debts.map((debt, index) => (
                            <th key={index}>{debt.creditor}</th> // Column headers for each debt
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
