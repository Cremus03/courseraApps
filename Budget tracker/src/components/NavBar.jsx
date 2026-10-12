import {NavLink} from "react-router-dom";

export function NavBar() {
    return (
        <div className="bg-slate-800 px-4 py-3 flex items-center gap-6">
            <span className="text-white font-bold text-lg">Budget Tracker</span>

            <nav className="flex gap-4">
                <NavLink to="/transactions"
                         className={({ isActive }) => `px-3 py-1.5 rounded font-medium ${ isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}` }>
                    Transactions
                </NavLink>
                <NavLink to="/budgets"
                         className={({ isActive }) => `px-3 py-1.5 rounded font-medium ${ isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}` }>
                    Budgets
                </NavLink>
            </nav>
        </div>
    )
}