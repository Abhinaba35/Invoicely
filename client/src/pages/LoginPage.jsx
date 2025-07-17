import { useState } from "react";
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

    return (
        <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-200 flex items-center justify-center py-8">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-emerald-100 flex flex-col gap-6">
                <h1 className="text-3xl font-extrabold text-emerald-700 mb-2 text-center tracking-tight drop-shadow">Login</h1>
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
        </div>
        </>
    );
};

export { LoginPage };
