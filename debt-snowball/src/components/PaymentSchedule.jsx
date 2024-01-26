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
        console.log('Debts:', debts);
        console.log('Additional Payment:', additionalPayment);

        // Clone and sort debts by interest rate from highest to lowest
        let remainingDebts = debts.map(debt => ({ ...debt })).sort((a, b) => b.interestRate - a.interestRate);
        let paymentSchedule = [];
        let month = 0;

        // Continue looping until all debts are paid off or we reach a safety iteration limit
        while (remainingDebts.some(debt => debt.balance > 0) && month < 1000) {
            console.log('Loop entered');
            let monthlyPayments = remainingDebts.map(debt => {
                if (debt.balance <= 0) {
                    return 0; // No payment needed for paid off debt
                }

                let interestPayment = (debt.balance * (debt.interestRate / 100)) / 12;
                let principalPayment = Math.min(debt.paymentAmount - interestPayment, debt.balance);

                // If this is the debt with the highest interest rate, add additional payment
                if (debt === remainingDebts[0]) {
                    principalPayment += additionalPayment;
                }

                // Calculate the total payment and update the balance for the next iteration
                let totalPayment = interestPayment + principalPayment;
                debt.balance -= principalPayment; // Reduce balance by principal payment

                return totalPayment;
            });

            paymentSchedule.push(monthlyPayments);
            console.log(`Payment schedule for month ${month + 1}:`, monthlyPayments);

            // Remove fully paid debts
            remainingDebts = remainingDebts.filter(debt => debt.balance > 0);
            month++;
        }

        if (month >= 1000) {
            console.error('Payment schedule calculation exceeded safety iteration limit.');
            return [];
        }

        console.log('Final payment schedule:', paymentSchedule);
        return paymentSchedule.map(monthPayments =>
            monthPayments.map(payment => payment.toFixed(2))
        );
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
