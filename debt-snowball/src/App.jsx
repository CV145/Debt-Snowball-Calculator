
import './App.css'
import { Provider } from 'react-redux';
import store from './redux/store';
import DebtForm from './components/DebtForm';
import DebtTable from './components/DebtTable';

function App() {
  return (
    <Provider store={store}>
      <DebtTable />
      <DebtForm />
    </Provider>
  )
}

export default App
