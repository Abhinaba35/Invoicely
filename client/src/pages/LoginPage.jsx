import { useState, useEffect } from "react";
import Skeleton from "../components/Skeleton";
import { Link } from "react-router";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { Navbar } from "../components/navbar";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            if (!email || !password) {
                ErrorToast("Email & password are required!");
                return;
            }

            const dataObj = {
                email,
                password,
            };

            const result = await axiosInstance.post("/auth/login", dataObj);

            if (result.status === 200) {
                SuccessToast(result.data.message);
                window.open("/", "_self");
            } else {
                ErrorToast(result.data.message);
            }
        } catch (err) {
            ErrorToast(`Cannot signup: ${err.response?.data?.message || err.message}`);
        }
    };

    const [formLoading, setFormLoading] = useState(false);

    
    const [showSkeleton, setShowSkeleton] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setShowSkeleton(false), 500);
        return () => clearTimeout(t);
    }, []);

    if (showSkeleton || formLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center py-8">
                    <div className="w-full max-w-4xl p-0 bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col md:flex-row gap-0">
                        <div className="flex-1 p-8 flex flex-col gap-6 justify-center">
                            <Skeleton height={36} width="60%" className="mb-4 mx-auto" />
                            <Skeleton height={48} className="mb-3 rounded" />
                            <Skeleton height={48} className="mb-3 rounded" />
                            <Skeleton height={48} className="mb-3 rounded" />
                        </div>
                        <div className="hidden md:flex flex-1 items-center justify-center bg-blue-50 rounded-r-2xl">
                            <Skeleton height={220} width={180} className="mx-auto rounded-xl" />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center py-8">
            <div className="w-full max-w-4xl p-0 bg-white rounded-2xl shadow-2xl border border-blue-100 flex flex-col md:flex-row gap-0">
                
                <div className="flex-1 p-8 flex flex-col gap-6 justify-center">
                  <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center tracking-tight drop-shadow">Login</h1>
                  <form className="flex flex-col gap-5 w-full" onSubmit={e => e.preventDefault()}>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 font-medium" htmlFor="user-email">Email</label>
                        <input
                            id="user-email"
                            type="email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-emerald-200 rounded-md py-2 px-3 text-emerald-700 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-gray-700 font-medium" htmlFor="user-password">Password</label>
                        <input
                            id="user-password"
                            type="password"
                            name="password"
                            required
                            className="border border-emerald-200 rounded-md py-2 px-3 text-emerald-700 focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-3 items-center mt-2">
                        <button
                            className="w-full py-2 rounded-full text-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow transition"
                            onClick={handleRegister}
                        >
                            Login
                        </button>
                        <p className="flex flex-col gap-2 items-center justify-center text-gray-600 text-sm mt-2">
                            <span>Don't have an account?</span>
                            <Link to="/signup" className="text-emerald-600 underline font-medium hover:text-emerald-800 transition">
                                Signup here
                            </Link>
                        </p>
                    </div>
                  </form>
                </div>
                
                <div className="hidden md:flex flex-1 items-center justify-center bg-blue-50 rounded-r-2xl">
                  <img src="/access.svg" alt="Login illustration" className="w-4/5 max-w-xs mx-auto" />
                </div>
            </div>
        </div>
        </>
    );
};

export { LoginPage };
