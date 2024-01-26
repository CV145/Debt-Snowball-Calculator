import React from 'react';
import { useSelector } from 'react-redux';
import './SummaryResults.css'; // Make sure to create this CSS file

function SummaryResults() {
    const debts = useSelector(state => state.debts.debts);

    // Function to calculate the totals and savings
    const calculateTotals = () => {
        const totalBalance = debts.reduce((acc, debt) => acc + debt.balance, 0);
        const totalPaymentAmount = debts.reduce((acc, debt) => acc + debt.paymentAmount, 0);

        // Interest cost and payments left may need to be calculated individually per debt,
        // depending on whether you store this information or calculate on the fly.
        // For this example, let's assume you have these values pre-calculated and stored.
        const totalInterestCost = debts.reduce((acc, debt) => acc + debt.interestCost, 0);
        const totalPaymentsLeft = Math.max(...debts.map(debt => debt.paymentsLeft));

        // Savings could be calculated as the difference between minimum payments over time vs snowball payments.
        // You would need to define how you want to calculate savings.
        // For example, it could be the difference in interest paid between two strategies.
        // For simplicity, this example will just sum the interestCost of all debts as savings.
        // In a real-world scenario, you'd have to calculate the interest over time for minimum payments
        // and compare it with the snowball strategy's interest over time.
        const savings = debts.reduce((acc, debt) => {
            // Placeholder for actual savings calculation logic
            const minimumPaymentsInterest = debt.balance * debt.interestRate / 100 / 12 * debt.paymentsLeft;
            return acc + (minimumPaymentsInterest - debt.interestCost);
        }, 0);

        return {
            totalBalance,
            totalPaymentAmount,
            totalInterestCost,
            totalPaymentsLeft,
            savings
        };
    };


    // Call the calculateTotals function to get the data needed for display
    const summary = calculateTotals();

    return (
        <table className="summary-results-table">
            <thead>
                <tr>
                    <th>Results</th>
                    <th>Balance Owed ($)</th>
                    <th>Interest Rate (%)</th>
                    <th>Payment Amount ($)</th>
                    <th>Interest Cost</th>
                    <th># of Pmts Left</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Current totals:</td>
                    <td>{summary.totalBalance.toFixed(2)}</td>
                    <td>N/A</td>
                    <td>{summary.totalPaymentAmount.toFixed(2)}</td>
                    <td>{summary.totalInterestCost.toFixed(2)}</td>
                    <td>{summary.totalPaymentsLeft}</td>
                </tr>
                <tr>
                    <td>Debt Snowball Totals:</td>
                    {/* Assuming you have this data */}
                    <td>{/* Calculated Total Debt Snowball Balance */}</td>
                    <td>N/A</td>
                    <td>{/* Calculated Total Debt Snowball Payment Amount */}</td>
                    <td>{/* Calculated Total Debt Snowball Interest Cost */}</td>
                    <td>{/* Calculated Total Debt Snowball Payments Left */}</td>
                </tr>
                <tr>
                    <td>Time and interest savings from Accelerated Debt Payoff Plan:</td>
                    <td colSpan="5">{summary.savings.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    );
}

export default SummaryResults;
