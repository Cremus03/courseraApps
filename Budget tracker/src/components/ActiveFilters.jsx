export function ActiveFilters({ startDate, endDate, categoryId, categories, onClearStartDate, onClearEndDate, onClearCategory }) {
    const category = categories.find( c => c.CategoryId === categoryId);

    const hasAnyFilter = startDate || endDate || categoryId

    if( !hasAnyFilter ) return null

    return (
        <div className="flex items-center gap-2 flex-wrap max-w-4xl">
            {startDate && (
                <span className="flex items-center gap-1 bg-slate-700 text-white text-sm px-3 py-1 rounded-full">
                    From: {startDate}
                <button onClick={onClearStartDate} className="text-slate-400 hover:text-red-400">X</button>
                </span>
            )}
            {endDate && (
            <span className="flex items-center gap-1 bg-slate-700 text-white text-sm px-3 py-1 rounded-full">
                    To: {endDate}
                <button onClick={onClearEndDate} className="text-slate-400 hover:text-red-400">X</button>
                </span>
            )}
            {categoryId && (
            <span className="flex items-center gap-1 bg-slate-700 text-white text-sm px-3 py-1 rounded-full">
                    Category: {category?.Icon} {category?.Name}
                <button onClick={onClearCategory} className="text-slate-400 hover:text-red-400">X</button>
                </span>
            )}
        </div>

    )
}