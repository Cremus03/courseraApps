import {NavBar} from "../components/NavBar.jsx";
import {Outlet} from "react-router-dom";

export function AppLayout() {
    return (
        <div className="min-h-screen bg-slate-900">
            <NavBar/>
            <Outlet/>
        </div>
    )
}