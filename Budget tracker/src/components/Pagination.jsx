const PAGE_SIZE_OPTIONS = [10,20,50,100]

export function Pagination({
    currentPage,
    totalPages,
    pageSize,
    onPageSizeChange,
    onPageChange,
    showAll,
    onToggleShowAll,
    totalItems,
                           }){
    function handlePageInputChange(e){
        const value = Number(e.target.value)
        if (value >=1 && value <= totalPages){
            onPageChange(value)
        }
    }

    return (
        <div className="flex items-center justify-between flex-wrap gap-3 max-w-4xl bg-slate-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-slate-300">
                <span>Rows per page</span>
                <select
                    value={pageSize}
                    onChange={e => onPageSizeChange(Number(e.target.value))}
                    disabled={showAll}
                    className="p-1 rounded bg-slate-700 text-white disabled:opacity-50">
                    {
                        PAGE_SIZE_OPTIONS.map(size => ( <option key={size} value={size}>{size}</option>))
                    }
                </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300">
                <button onClick={() => onPageChange(currentPage - 1)}
                        disabled={showAll || currentPage <= 1}
                        className="px-2 oy-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40">
                    ←
                </button>
                <input type="number"
                       value={currentPage}
                       onChange={handlePageInputChange}
                       disabled={showAll}
                       min={1}
                       max={totalPages}
                       className="w-14 p-1 rounded bg-slate-700 text-white text-center disabled:opacity-50"/>
                <span>/{totalPages}</span>

                <button onClick={() => onPageChange(currentPage + 1)}
                        disabled={showAll || currentPage >= totalPages}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-40">
                    →
                </button>
            </div>

            <button onClick={onToggleShowAll}
                    className="text-sm text-emerald-400 hover:text-emerald-300">
                {showAll ? 'Back to pages' : `Show all (${totalItems})`}
            </button>
        </div>
    )
}
