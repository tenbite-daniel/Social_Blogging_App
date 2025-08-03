import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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

export default function PasswordReset() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [step, setStep] = useState("request"); 
    const [resetForm, setResetForm] = useState({
        resetToken: "",
        newPassword: "",
        confirmPassword: ""
    });

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (error) setError(""); 
    };

    const handleResetFormChange = (e) => {
        setResetForm({ ...resetForm, [e.target.name]: e.target.value });
        if (error) setError(""); 
    };

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("/auth/forgot-password", { email });
            setSuccess(`Password reset instructions have been sent to your email. Reset token: ${res.data.resetToken}`);
            setStep("reset");
        } catch (err) {
            console.error(err.response?.data);
            const errorMessage = err.response?.data?.error || "Failed to send reset email. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        
        if (resetForm.newPassword !== resetForm.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        if (resetForm.newPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("/auth/reset-password", {
                resetToken: resetForm.resetToken,
                newPassword: resetForm.newPassword
            });
            setSuccess("Password reset successfully! You can now login with your new password.");
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error(err.response?.data);
            const errorMessage = err.response?.data?.error || "Failed to reset password. Please try again.";
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
                        <span className="font-serif font-extrabold text-3xl leading-none tracking-normal text-cyan-400 dark:text-cyan-300 transition-colors duration-200">
                            Blog EASE
                        </span>
                    </div>
                    <h2 className="mt-5 text-xl font-bold max-w-64 text-center text-gray-900 dark:text-white transition-colors duration-200">
                        {step === "request" ? "Reset your password" : "Enter new password"}
                    </h2>
                    {step === "request" && (
                        <p className="mt-3 text-gray-600 dark:text-gray-300 text-center max-w-64 transition-colors duration-200">
                            Enter your email address and we'll send you instructions to reset your password.
                        </p>
                    )}
                </section>

                <section className="w-full max-w-xl px-10">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg transition-colors duration-200">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-lg transition-colors duration-200">
                            {success}
                        </div>
                    )}

                    {step === "request" ? (
                        <form
                            className="flex flex-col justify-center items-center"
                            onSubmit={handleRequestReset}
                        >
                            <p className="w-full flex flex-col justify-center items-start gap-2">
                                <label htmlFor="email" className="text-lg text-gray-900 dark:text-white transition-colors duration-200">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="youremail@gmail.com"
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-300 transition-colors duration-200"
                                    disabled={loading}
                                />
                            </p>
                            <button
                                className="w-full p-2 border border-gray-500 dark:border-gray-400 mt-5 rounded-lg text-white font-semibold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Reset Instructions"}
                            </button>
                        </form>
                    ) : (
                        <form
                            className="flex flex-col justify-center items-center"
                            onSubmit={handlePasswordReset}
                        >
                            <p className="w-full flex flex-col justify-center items-start gap-2">
                                <label htmlFor="resetToken" className="text-lg text-gray-900 dark:text-white transition-colors duration-200">
                                    Reset Token
                                </label>
                                <input
                                    type="text"
                                    name="resetToken"
                                    id="resetToken"
                                    required
                                    autoFocus
                                    value={resetForm.resetToken}
                                    onChange={handleResetFormChange}
                                    placeholder="Enter the token from your email"
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-300 transition-colors duration-200"
                                    disabled={loading}
                                />
                            </p>
                            <p className="w-full flex flex-col justify-center items-start gap-2 mt-2">
                                <label htmlFor="newPassword" className="text-lg text-gray-900 dark:text-white transition-colors duration-200">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    id="newPassword"
                                    required
                                    value={resetForm.newPassword}
                                    onChange={handleResetFormChange}
                                    placeholder="Enter new password"
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-300 transition-colors duration-200"
                                    disabled={loading}
                                />
                            </p>
                            <p className="w-full flex flex-col justify-center items-start gap-2 mt-2">
                                <label htmlFor="confirmPassword" className="text-lg text-gray-900 dark:text-white transition-colors duration-200">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    required
                                    value={resetForm.confirmPassword}
                                    onChange={handleResetFormChange}
                                    placeholder="Confirm new password"
                                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 dark:focus:ring-cyan-300 transition-colors duration-200"
                                    disabled={loading}
                                />
                            </p>
                            <button
                                className="w-full p-2 border border-gray-500 mt-5 rounded-lg text-white font-semibold bg-signin-btn hover:bg-opacity-90 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}

                    <section className="mt-5 text-center">
                        <Link
                            to="/login"
                            className="font-serif font-medium text-md leading-none text-purple-600 hover:text-purple-400 transition-colors duration-200 bg-transparent focus:outline-none"
                        >
                            Back to Login
                        </Link>
                        {step === "reset" && (
                            <>
                                <span className="mx-2">|</span>
                                <button
                                    onClick={() => {
                                        setStep("request");
                                        setError("");
                                        setSuccess("");
                                        setResetForm({ resetToken: "", newPassword: "", confirmPassword: "" });
                                    }}
                                    className="font-serif font-medium text-md leading-none text-cyan-600 hover:text-cyan-400 transition-colors duration-200 bg-transparent focus:outline-none border-none cursor-pointer"
                                >
                                    Request New Token
                                </button>
                            </>
                        )}
                    </section>
                </section>
            </section>
            <Footer />
        </article>
    );
}
