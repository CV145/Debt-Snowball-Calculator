import React from 'react';
import { useSelector } from 'react-redux';
import './PaymentSchedule.css'; // Make sure to create this CSS file for styling

function PaymentSchedule() {
    const debts = useSelector(state => state.debts.debts); // Retrieve your debts from the state
    const additionalPayment = useSelector(state => state.additionalPayment) || 0; // Retrieve any additional payment amount

    //The generatePaymentSchedule function will generate an array of arrays, where each sub-array represents the payments for a particular month across all debts.
    function generatePaymentSchedule(debts, additionalPayment) {
        console.log('Debts:', debts);
        console.log('Additional Payment:', additionalPayment);



        // Clone and sort debts by interest rate from highest to lowest
        let remainingDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
        let paymentSchedule = [];
        let month = 0;

        // Continue looping until all debts are paid off or we reach a safety iteration limit to prevent infinite loop
        while (remainingDebts.some(debt => debt.balance > 0) && month < 1000) {
            console.log('Loop entered');
            let monthlyPayments = [];

            // Track available payment, starting with the additional payment amount
            let availablePayment = additionalPayment;

            for (let i = 0; i < remainingDebts.length; i++) {
                let debt = remainingDebts[i];
                let interestPayment = (debt.balance * (debt.interestRate / 100)) / 12;
                let principalPayment = debt.paymentAmount - interestPayment;

                // If this is the debt with the highest interest rate and we have additional payment
                if (i === 0) {
                    principalPayment += availablePayment;
                }

                if (principalPayment > debt.balance) {
                    // If the principal payment exceeds the balance, adjust the available payment
                    availablePayment = principalPayment - debt.balance;
                    principalPayment = debt.balance;
                } else {
                    // No available payment remains
                    availablePayment = 0;
                }

                debt.balance -= principalPayment; // Pay off the principal
                monthlyPayments[i] = principalPayment + interestPayment; // Total payment for this debt this month

                // If the debt is fully paid off, remove it from the array
                if (debt.balance <= 0) {
                    remainingDebts.splice(i, 1);
                    i--; // Adjust the index to account for the removed element
                }
            }

            paymentSchedule.push(monthlyPayments);
            console.log('Payment schedule for the month:', monthlyPayments);
            month++; // Increment the month count
        }

        if (month >= 1000) {
            // If we hit the safety limit, log an error and return an empty array
            console.error('Payment schedule calculation exceeded safety iteration limit.');
            return [];
        }

        return paymentSchedule;
    }



    const paymentSchedule = generatePaymentSchedule(debts, additionalPayment);

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
                                    {typeof payment === 'number' ? payment.toFixed(2) : '0.00'}
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
