import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
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

export default function Register() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = React.useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [success, setSuccess] = React.useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (error) setError(""); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Basic validation
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

        try {
            console.log('Attempting registration with:', form);
            const res = await axios.post("/auth/register", form);
            console.log('Registration response:', res.data);
            setSuccess("Registration successful! You can now log in.");
            
            // Optionally auto-login after registration
            setTimeout(() => {
                navigate("/login");
            }, 2000);
            
        } catch (err) {
            console.error('Registration error details:', {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message
            });
            const errorMessage = err.response?.data?.error || 
                                err.response?.data?.details || 
                                err.response?.data?.message ||
                                `Registration failed: ${err.message}`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <article>
            <Header />
            <section className="w-full flex flex-col md:flex-row items-center justify-center gap-10 bg-soft-vertical py-10 lg:py-[3.6rem]">
                <section>
                    <div className="flex items-center justify-center space-x-3">
                        <Logo />
                        <span className="font-serif font-extrabold text-3xl leading-none tracking-normal  text-cyan-400">
                            Blog EASE
                        </span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold max-w-64 text-center">
                        Join our community in just a few clicks
                    </h2>
                </section>

                <section className="w-full max-w-xl px-10 ">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {success}
                        </div>
                    )}
                    <form
                        className="flex flex-col justify-center items-center"
                        onSubmit={handleSubmit}
                    >
                        <p className="w-full flex flex-col justify-center items-start gap-2">
                            <label htmlFor="username" className="text-lg">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="jhon"
                                required
                                value={form.username}
                                onChange={handleChange}
                                autoFocus
                                autoComplete="on"
                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                disabled={loading}
                                minLength="3"
                            />
                        </p>
                        <p className="w-full flex flex-col justify-center items-start gap-2 mt-2">
                            <label htmlFor="email" className="text-lg">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="on"
                                placeholder="youremail@gmail.com"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                disabled={loading}
                            />
                        </p>
                        <p className="w-full flex flex-col justify-center items-start gap-2 mt-2">
                            <label htmlFor="password" className="text-lg">
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
                                className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                disabled={loading}
                                minLength="6"
                            />
                            <span className="text-sm text-gray-500">Password must be at least 6 characters</span>
                        </p>
                        <button
                            className="w-full p-2 border border-gray-500 mt-5 rounded-lg text-white font-semibold bg-signin-btn hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Sign Up"}
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
                        <span>Have an account? </span>
                        <Link
                            to="/login"
                            className="font-serif font-medium text-md leading-none text-purple-600 hover:text-purple-400 transition-colors duration-200 bg-transparent focus:outline-none"
                        >
                            Sign In
                        </Link>
                    </section>
                </section>
            </section>
            <Footer />
        </article>
    );
}