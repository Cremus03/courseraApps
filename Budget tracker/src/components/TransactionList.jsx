import { useConvertedAmount } from '../hooks/useConvertedAmount.js'
import { CURRENCIES } from '../data/currencies.js'
import {Button, Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";

function TransactionRow({ transaction, category, displayCurrency, onDelete, onEdit }) {
    const { convertedAmount, loading } = useConvertedAmount(
        transaction.Amount,
        transaction.Date,
        transaction.Currency,
        displayCurrency
    )

    const isIncome = transaction.Type === 'income'

    return (
        <tr className="border-b border-slate-700">
            <td className="py-2 px-3 flex items-center gap-2">
                <span>{category?.Icon}</span>
                <span>{category?.Name}</span>
            </td>
            <td className="py-2 px-3 text-slate-300">{transaction.Date}</td>
            <td className="py-2 px-3 text-slate-300">{transaction.Description}</td>
            <td className="py-2 px-3 text-slate-300 capitalize">{transaction.PaymentMethod}</td>
            <td className={isIncome ? 'py-2 px-3 text-emerald-400 font-bold' : 'py-2 px-3 text-red-400 font-bold'}>
                {loading ? '...' : `${isIncome ? '+' : '-'}${convertedAmount.toFixed(2)} ${displayCurrency}`}
            </td>
            <td className="py-2 px-3">
                <Menu as="div" className="relative inline-block text-left">
                    <MenuButton className="text-slate-300 hover:text-white px-2"></MenuButton>
                    <MenuItems anchor="bottom end"
                               className="bg-slate-700 rounded shadow-lg py-1 min-w-[120px] focus:outline-none">
                        <MenuItem>
                            <button onClick={() => onEdit(transaction.TransactionId)}
                                    className="w-full text-left px-3 py-2 text-sm text-white data-focus:bg-slate-600">
                                Edit
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button onClick={() => onDelete(transaction.TransactionId)}
                                    className="w-full text-left px-3 py-2 text-sm text-white data-focus:bg-slate-600">
                                Delete
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </td>
        </tr>
    )
}

export function TransactionList({ transactions, categories, displayCurrency, setDisplayCurrency, onDelete, onEdit }) {

    function getCategory(categoryId){
        return categories.find(c => c.CategoryId === categoryId)
    }

    const sorted = transactions

    return (
        <div className="bg-slate-800 p-4 rounded-lg max-w-4xl">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-white">Transactions</h2>

                <select
                    value={displayCurrency}
                    onChange={(e) => setDisplayCurrency(e.target.value)}
                    className="p-1 rounded bg-slate-700 text-white text-sm"
                >
                    {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                            Show in {c.code}
                        </option>
                    ))}
                </select>
            </div>

            <table className="w-full text-left text-white">
                <thead>
                <tr className="border-b border-slate-600 text-slate-400 text-sm">
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">Payment</th>
                    <th className="py-2 px-3">Amount</th>
                    <th className="py-2 px-3"></th>
                </tr>
                </thead>
                <tbody>
                {sorted.map((t) => (
                    <TransactionRow
                        key={t.TransactionId}
                        transaction={t}
                        category={getCategory(t.CategoryId)}
                        displayCurrency={displayCurrency}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
                </tbody>
            </table>

            {sorted.length === 0 && <p className="text-slate-400 text-center">No transactions yet.</p>}
        </div>
    )
}