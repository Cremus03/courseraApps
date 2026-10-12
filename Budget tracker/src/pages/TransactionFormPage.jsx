import {useNavigate, useParams} from "react-router-dom";
import {useFinance} from "../context/FinanceContext.jsx";
import {TransactionForm} from "../components/TransactionForm.jsx";

export function TransactionFormPage() {
    const { transactionId } = useParams()
    const navigate = useNavigate()
    const { transactions, loading, addTransaction, updateTransaction } = useFinance()

    if (loading) {
        return <p className="text-white p-4">Loading...</p>
    }

    const existingTransaction = transactionId ? transactions.find(t => t.TransactionId === transactionId) : null

    if (transactionId && !existingTransaction) {
        return (
            <div className=" min-h-screen bg-slate-900 text-white p-4">
                <p>Transaction not found.</p>
                <button onClick={() => navigate('/transactions')} className="text-emerald-400 underline mt-2">
                    Go back
                </button>
            </div>
        )
    }

    function handleSubmit(data) {
        if (existingTransaction) {
            updateTransaction(existingTransaction.TransactionId, data)
        } else {
            addTransaction(data)
        }
        navigate('/transactions')
    }

    return (
        <div className=" min-h-screen bg-slate-900 text-white p-4">
            <div className="flex items-center justify-between max-w-md mb-4">
                <h1 className="text-2xl font-bold">
                    {existingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                </h1>
                <button onClick={() => navigate('/transactions')} className="text-slate-300 hover:text-white">
                    Go back
                </button>
            </div>

            <TransactionForm
                initialData={existingTransaction}
                onSubmit={handleSubmit}
                submitLabel={existingTransaction ? 'Save changes' : 'Add transaction'}/>

        </div>
    )
}