
import './App.css'
import { Provider } from 'react-redux';
import store from './redux/store';
import DebtForm from './components/DebtForm';
import DebtTable from './components/DebtTable';
import SummaryResults from './components/SummaryResults';
import PaymentSchedule from './components/PaymentSchedule';

function App() {
  return (
    <Provider store={store}>
      <DebtTable />
      <DebtForm />
      <SummaryResults />
      <PaymentSchedule />
    </Provider>
  )
}

export default App
