import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axiosInstance";
import Footer from "../components/Footer";
import Header from "../components/Header";

const Logo = () => (
    <svg
        width="40"
        height="44"
        viewBox="0 0 40 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M22 2L2 26H20L18 42L38 18H20L22 2Z"
            stroke="#36C5D1"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function Login() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(""); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("/auth/login", form);
            
            if (res.data.accessToken) {
                
                const authData = {
                    accessToken: res.data.accessToken,
                    user: { email: form.email }
                };
                
                setAuth(authData);
                
               
                try {
                    const profileResponse = await axios.get("/auth/profile", {
                        headers: {
                            Authorization: `Bearer ${res.data.accessToken}`
                        }
                    });
                    
                   
                    setAuth({
                        accessToken: res.data.accessToken,
                        user: profileResponse.data.user,
                    });
                } catch (profileError) {
                    console.warn('Could not fetch profile on login, will try later:', profileError);
                    
                }
                
               
                navigate("/home");
            }
        } catch (err) {
            console.error(err.response?.data);
            const errorMessage = err.response?.data?.error || "Login failed. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <article className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
            <Header />
            <section className="w-full flex flex-col md:flex-row items-center justify-center gap-10 py-10 lg:py-[6.2rem]">
                <section>
                    <div className="flex items-center justify-center space-x-3">
                        <Logo />
                        <span className="font-serif font-extrabold text-3xl leading-none tracking-normal text-cyan-400 dark:text-cyan-300">
                            Blog EASE
                        </span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold max-w-64 text-center text-gray-900 dark:text-white transition-colors duration-200">
                        Join our community in just a few clicks
                    </h2>
                </section>

                <section className="w-full max-w-xl px-10 ">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg transition-colors duration-200">
                            {error}
                        </div>
                    )}
                    <form
                        className="flex flex-col justify-center items-center"
                        onSubmit={handleSubmit}
                    >
                        <p className="w-full flex flex-col justify-center items-start gap-2">
                            <label htmlFor="email" className="text-lg text-gray-900 dark:text-white transition-colors duration-200">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                autoFocus
                                autoComplete="on"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="youremail@gmail.com"
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-300 transition-colors duration-200"
                                disabled={loading}
                            />
                        </p>
                        <p className="w-full flex flex-col justify-center items-start gap-2 mt-2">
                            <label htmlFor="password" className="text-lg text-gray-900 dark:text-white transition-colors duration-200">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                autoComplete="on"
                                placeholder="*******"
                                value={form.password}
                                onChange={handleChange}
                                className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-300 transition-colors duration-200"
                                disabled={loading}
                            />
                        </p>
                        <div className="w-full flex justify-end mt-1">
                            <Link
                                to="/password-reset"
                                className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors duration-200"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <button
                            className="w-full p-2 border border-gray-500 mt-5 rounded-lg text-white font-semibold bg-signin-btn hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                        <button 
                            type="button"
                            className="w-full p-2 border border-gray-500 mt-5 rounded-lg bg-white font-semibold hover:bg-[whitesmoke] transition-colors duration-300"
                            disabled={loading}
                        >
                            Continue with Google
                        </button>
                    </form>
                    <section className="mt-5">
                        <span>Don't have an account? </span>
                        <Link
                            to="/register"
                            className="font-serif font-medium text-md leading-none text-purple-600 hover:text-purple-400 transition-colors duration-200 bg-transparent focus:outline-none"
                        >
                            Register
                        </Link>
                    </section>
                </section>
            </section>
            <Footer />
        </article>
    );
}