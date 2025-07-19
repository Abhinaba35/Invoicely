
import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { ProfilePage } from "../pages/ProfilePage";
import { ErrorToast } from "../utils/toastHelper";
import React, { useState } from "react";


const Navbar = () => {
    const { user = {} } = useAppContext();

    const { isAuthenticated } = user;

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/auth/logout");
            //todo
            window.location.reload();
        } catch (err) {
            // todo
            console.error("Logout failed:", err);
            ErrorToast("Logout failed. Please try again.");
            console.error(err);
        }
    };

    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="px-4 md:px-8 py-3 flex items-center justify-between bg-white/80 backdrop-blur border-b border-blue-200 shadow-sm sticky top-0 z-50">
            <div className="flex items-center gap-2 select-none">
                <Link to="/" className="flex items-center gap-2">
                    <span className="flex w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full items-center justify-center text-white font-bold text-xl shadow">i</span>
                    <span className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm">Invoicely</span>
                </Link>
            </div>
            {/* Hamburger for mobile */}
            <button
                className="md:hidden flex items-center px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setMenuOpen(m => !m)}
                aria-label="Toggle menu"
            >
                <svg className="w-7 h-7 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            {/* Desktop menu */}
            <div className="hidden md:flex gap-2 items-center">
                {!isAuthenticated ? (
                    <>
                        <Link to="/login" className="px-4 py-1 rounded-full font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition">Login</Link>
                        <Link to="/signup" className="px-4 py-1 rounded-full font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition">Signup</Link>
                    </>
                ) : (
                    <>
                        <Link to="/dashboard" className="px-4 py-1 rounded-full font-semibold text-blue-700 hover:bg-blue-50 transition">Dashboard</Link>
                        <Link to="/invoices" className="px-4 py-1 rounded-full font-semibold text-blue-700 hover:bg-blue-50 transition">Invoices</Link>
                        <Link to="/expenses" className="px-4 py-1 rounded-full font-semibold text-blue-700 hover:bg-blue-50 transition">Expenses</Link>
                        <Link to="/ai-analysis" className="px-4 py-1 rounded-full font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 transition">AI Analysis</Link>
                        <Link
                            to="#"
                            className="px-4 py-1 rounded-full font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition"
                            onClick={e => { e.preventDefault(); handleLogout(); }}
                        >
                            Logout
                        </Link>
                        <Link to="/profile" className="ml-2 flex items-center group" title="Profile">
                            <span className="w-9 h-9 rounded-full border-2 border-blue-300 shadow bg-white overflow-hidden flex items-center justify-center group-hover:ring-2 group-hover:ring-blue-400 transition">
                                <img
                                    src={user?.imageUrl || "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1351.jpg?semt=ais_hybrid&w=740"}
                                    alt="Profile"
                                    className="object-cover w-full h-full"
                                />
                            </span>
                        </Link>
                    </>
                )}
            </div>
            {/* Mobile menu */}
            {menuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white/95 border-b border-blue-200 shadow-md flex flex-col items-center gap-2 py-4 z-50 md:hidden animate-fade-in">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="px-4 py-2 rounded-full font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition w-11/12 text-center" onClick={()=>setMenuOpen(false)}>Login</Link>
                            <Link to="/signup" className="px-4 py-2 rounded-full font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 transition w-11/12 text-center" onClick={()=>setMenuOpen(false)}>Signup</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/dashboard" className="px-4 py-2 rounded-full font-semibold text-blue-700 hover:bg-blue-50 transition w-11/12 text-center" onClick={()=>setMenuOpen(false)}>Dashboard</Link>
                            <Link to="/invoices" className="px-4 py-2 rounded-full font-semibold text-blue-700 hover:bg-blue-50 transition w-11/12 text-center" onClick={()=>setMenuOpen(false)}>Invoices</Link>
                            <Link to="/expenses" className="px-4 py-2 rounded-full font-semibold text-blue-700 hover:bg-blue-50 transition w-11/12 text-center" onClick={()=>setMenuOpen(false)}>Expenses</Link>
                            <Link to="/ai-analysis" className="px-4 py-2 rounded-full font-semibold text-blue-700 border border-blue-200 hover:bg-blue-50 transition w-11/12 text-center" onClick={()=>setMenuOpen(false)}>AI Analysis</Link>
                            <Link
                                to="#"
                                className="px-4 py-2 rounded-full font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition w-11/12 text-center"
                                onClick={e => { e.preventDefault(); setMenuOpen(false); handleLogout(); }}
                            >
                                Logout
                            </Link>
                            <Link to="/profile" className="flex items-center justify-center mt-2" title="Profile" onClick={()=>setMenuOpen(false)}>
                                <span className="w-10 h-10 rounded-full border-2 border-blue-300 shadow bg-white overflow-hidden flex items-center justify-center group-hover:ring-2 group-hover:ring-blue-400 transition">
                                    <img
                                        src={user?.imageUrl || "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-profile-picture-business-profile-woman-suitable-social-media-profiles-icons-screensavers-as-templatex9_719432-1351.jpg?semt=ais_hybrid&w=740"}
                                        alt="Profile"
                                        className="object-cover w-full h-full"
                                    />
                                </span>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export { Navbar };
