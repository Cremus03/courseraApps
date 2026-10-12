import {useCategories} from "../hooks/useCategories.js";
import {useState} from "react";
import {CURRENCIES} from "../data/currencies.js";

export function TransactionForm({ initialData, onSubmit, submitLabel= "Add"}) {
    const {categories, loading} = useCategories()

    const [amount, setAmount] = useState(initialData?.Amount ?? '')
    const [categoryId, setCategoryId] = useState(initialData?.CategoryId ?? '')
    const [date, setDate] = useState(initialData?.Date ?? '')
    const [description, setDescription] = useState( initialData?.Description ?? '')
    const [paymentMethod, setPaymentMethod] = useState( initialData?.PaymentMethod ?? 'card')
    const [currency, setCurrency] = useState(initialData?.Currency ?? 'RON')
    const [error, setError] = useState('')

    function handleSubmit(e) {
        e.preventDefault();
        setError('')

        if(!amount || Number(amount) <= 0) {
            setError('Amount must be greater than 0.')
            return
        }

        if(!categoryId){
            setError('Please select a category.')
            return
        }

        if(!date){
            setError('Please select a date.')
            return
        }

        const selectedCategory = categories.find(c => c.CategoryId === categoryId)

        onSubmit({
            Amount : Number(amount),
            CategoryId : categoryId,
            Type : selectedCategory.Type,
            Date : date,
            Description : description,
            PaymentMethod : paymentMethod,
            Currency : currency,
        })
    }

    if (loading)
        return <p className="text-white">Loading categories...</p>

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800 p-4 rounded-lg flex flex-col gap-3 max-w-md">
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"/>

            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white">
                <option value="">Select category</option>
                {categories.map((c) => (
                    <option key={c.CategoryId} value={c.CategoryId}>
                        {c.Icon} {c.Name} ({c.Type})
                    </option>
                ))}
            </select>

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"
            />

            <input
                type="text"
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"
            />

            <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white"
            >
                <option value="card">Card</option>
                <option value="cash">Cash</option>
            </select>

            <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="p-2 rounded bg-slate-700 text-white">

                {CURRENCIES.map(c => (<option key={c.code} value={c.code}>{c.symbol}
                </option>))}

            </select>
            <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded font-semibold">
                {submitLabel}
            </button>

        </form>
    )
}