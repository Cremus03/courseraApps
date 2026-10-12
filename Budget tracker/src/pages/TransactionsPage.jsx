import {useNavigate} from "react-router-dom";
import {TransactionList} from "../components/TransactionList.jsx";
import {useFinance} from "../context/FinanceContext.jsx";
import {useCategories} from "../hooks/useCategories.js";
import {useState} from "react";
import {TransactionFilters} from "../components/TransactionFilters.jsx";
import {ActiveFilters} from "../components/ActiveFilters.jsx";
import {Pagination} from "../components/Pagination.jsx";

export function TransactionsPage() {
    const navigate = useNavigate();
    const {transactions, loading, deleteTransaction, displayCurrency, setDisplayCurrency} = useFinance()
    const {categories, loading: categoriesLoading} = useCategories()

    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [showAll, setShowAll] = useState(false)

    if (loading || categoriesLoading)
        return <p className="text-white p-4">Loading...</p>

    const filteredTransactions = transactions.filter(t => {
        if(startDate && t.Date < startDate)
            return false
        if(endDate && t.Date > endDate)
            return false
        if(categoryId && t.CategoryId !== categoryId)
            return false
        return true
    })

    const sortedTransactions = [...filteredTransactions].sort( (a,b) => b.Date.localeCompare(a.Date))

    const totalItems = sortedTransactions.length

    let effectivePageSize = pageSize
    let warningMessage = null

    if (showAll) {
        if (totalItems > 200 ) {
            effectivePageSize = 200
            warningMessage = `You have ${totalItems} transactions. Showing a maximum of 200 per page`
        } else {
            effectivePageSize = totalItems || 1
        }
    }

    const totalPages = Math.max(1, Math.ceil(totalItems / effectivePageSize))
    const safeCurrentPage = Math.min(currentPage, totalPages)
    const startIndex = (safeCurrentPage - 1) * effectivePageSize
    const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + effectivePageSize)

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between max-w-4xl ">
                <h1 className="text-2xl font-bold">Transactions</h1>
                <button onClick={() => navigate('/transactions/add')}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded font-semibold">
                    + Add Transaction
                </button>
            </div>
            <TransactionFilters
                startDate={startDate}
                endDate={endDate}
                categoryId={categoryId}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onCategoryChange={setCategoryId}
                categories={categories}/>

            <ActiveFilters
                startDate={startDate}
                endDate={endDate}
                categoryId={categoryId}
                categories={categories}
                onClearStartDate={() => setStartDate('')}
                onClearEndDate={() => setEndDate('')}
                onClearCategory={() => setCategoryId('')}/>

            {warningMessage && ( <p className="text-yellow-400 text-sm max-w-4xl">{warningMessage}</p> )}

            <TransactionList
            transactions={paginatedTransactions}
            categories={categories}
            displayCurrency={displayCurrency}
            setDisplayCurrency={setDisplayCurrency}
            onDelete={deleteTransaction}
            onEdit={id => navigate(`/transactions/edit/${id}`)}/>

            <Pagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageSizeChange={size => {setPageSize(size); setCurrentPage(1)}}
                onPageChange={setCurrentPage}
                showAll={showAll}
                onToggleShowAll={() => {setShowAll(!showAll); setCurrentPage(1)}}
                totalItems={totalItems}/>
        </div>
    )
}