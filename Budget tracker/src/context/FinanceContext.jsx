import {createContext, useContext, useEffect, useState} from "react";
import {db} from "../db/db.js";

const FinanceContext = createContext();

export function FinanceProvider({children}) {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [displayCurrency, setDisplayCurrency] = useState('RON')
    const [budgets, setBudgets] = useState([])

    useEffect(() => {
        loadTransactions()
        loadBudgets()
    },[])

    async function loadTransactions(){
        const all = await db.Transactions.toArray()
        setTransactions(all)
        setLoading(false)
    }

    async function loadBudgets(){
        const all = await db.Budgets.toArray()
        setBudgets(all)
    }

    async function addTransaction(data){
        const newTransaction = {
            TransactionId : crypto.randomUUID(),
            ...data,
        }
        await db.Transactions.add(newTransaction)
        setTransactions((prev) => [...prev, newTransaction])
    }

    async function updateTransaction(transactionId, data){
        await db.Transactions.update(transactionId, data)
        setTransactions((prev) =>
        prev.map((t) => t.TransactionId === transactionId ? { ...t, ...data } : t))
    }

    async function deleteTransaction(transactionId){
        await db.Transactions.delete(transactionId)
        setTransactions((prev) =>
        prev.filter((t) => t.TransactionId !== transactionId))
    }

    async function setBudget( categoryId, month, amount, currency ){
        const existing = budgets.find(b => b.categoryId === categoryId && b.month === month)

        if (existing) {
            await db.Budgets.update( existing.BudgetId, {Amount: amount, Currency: currency })
            setBudgets((prev) => prev.map(b => b.BudgetId === existing.BudgetId ? {...b, Amount: amount, Currency: currency } : b))
        } else {
            const newBudget = {
                BudgetId : crypto.randomUUID(),
                CategoryId : categoryId,
                Month : month,
                Amount : amount,
                Currency: currency,
            }
            await db.Budgets.update(newBudget)
            setBugdets(prev => [...prev, newBudget])
        }
    }

    const value= {
        transactions,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        displayCurrency,
        setDisplayCurrency,
        budgets,
        setBudgets,
    }

    return (
        <FinanceContext.Provider value={value}>
            {children}
        </FinanceContext.Provider>
    )
}

export function useFinance(){
    const context = useContext(FinanceContext)
    if( !context ){
        throw new Error('useFinance must be used within a FinanceProvider')
    }
    return context
}