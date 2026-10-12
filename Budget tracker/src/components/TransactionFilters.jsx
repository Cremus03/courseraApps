import {useState} from "react";

export function TransactionFilters({
    startDate,
    endDate,
    categoryId,
    onStartDateChange,
    onEndDateChange,
    onCategoryChange,
    categories,
}) {

    const [startFocused, setStartFocused] = useState(false)
    const [endFocused, setEndFocused] = useState(false)

    const showStartPlaceholder = !startFocused && !startDate
    const showEndPlaceholder = !endFocused && !endDate

    return (
        <div className="bg-slate-800 p-4 rounded-lg flex flex-wrap items-end gap-3 max-w-4xl">
            <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">From</label>
                <div className="relative">
                    <input
                        type="date"
                        value={startDate}
                        onChange={e => onStartDateChange(e.target.value)}
                        onFocus={() => setStartFocused(true)}
                        onBlur={() => setStartFocused(false)}
                        className={`p-2 rounded bg-slate-700 w-full ${showStartPlaceholder ? 'text-transparent' : 'text-white' }`}/>
                    {showStartPlaceholder && (
                        <span className="absolute left-2 top-2 text-slate-400 text-sm pointer-events-none">
                            No date selected
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">To</label>
                <div className="relative">
                    <input type="date"
                        value={endDate}
                        onChange={e => onEndDateChange(e.target.value)}
                           onFocus={() => setEndFocused(true)}
                           onBlur={() => setEndFocused(false)}
                           className={`p-2 rounded bg-slate-700 w-full ${showEndPlaceholder ? 'text-transparent' : 'text-white'}`}/>
                    {showEndPlaceholder && (
                        <span className="absolute left-2 top-2 text-slate-400 text-sm pointer-events-none">
                            No date selected
                        </span>
                    )}
                </div>
            </div>
            <div className="flex flex-col">
                <label className="text-xs text-slate-400 mb-1">Category</label>
                <select value={categoryId}
                        onChange={e => onCategoryChange(e.target.value)}
                        className="p-2 rounded bg-slate-700 text-white">
                    <option value="">All Categories</option>
                    {categories.map(c => (<option key={c.CategoryId} value={c.CategoryId}>
                        {c.Icon} {c.Name}
                    </option> ))}

                </select>
            </div>
        </div>
    )
}