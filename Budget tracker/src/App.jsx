import { FinanceProvider } from './context/FinanceContext.jsx'
import { Navigate, Route, Routes } from "react-router-dom";
import { TransactionsPage } from './pages/TransactionsPage.jsx'
import { TransactionFormPage } from './pages/TransactionFormPage.jsx'
import {AppLayout} from "./layouts/AppLayout.jsx";

function App() {
    return (
        <FinanceProvider>
            <Routes>
                <Route element={<AppLayout/>}>
                    <Route path="/" element={<Navigate to="/transactions" replace/> }/>
                    <Route path="/transactions" element={<TransactionsPage/>}/>
                    <Route path="/transactions/add" element={<TransactionFormPage/>}/>
                    <Route path="/transactions/edit/:transactionId" element={<TransactionFormPage/>}/>
                </Route>
            </Routes>
        </FinanceProvider>
    )
}

export default App