import React from "react";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axiosInstance";
import { Link } from "react-router-dom";
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
    const [form, setForm] = React.useState({
        username: "",
        email: "",
        password: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("/auth/register", form);
            setAuth({
                accessToken: res.data.accessToken,
                user: form.email, // Or whatever user info you want
            });
            alert("Registration success!");
        } catch (err) {
            console.error(err.response?.data);
            alert("Registration failed");
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
                                className="w-full p-2 rounded-lg"
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
                                className="w-full p-2 rounded-lg"
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
                                className="w-full p-2 rounded-lg"
                            />
                        </p>
                        <button
                            className="w-full p-2 border border-gray-500 mt-5 rounded-lg text-white font-semibold bg-signin-btn"
                            type="submit"
                        >
                            Sign Up
                        </button>
                        <button className="w-full p-2 border border-gray-500 mt-5 rounded-lg bg-white font-semibold hover:bg-[whitesmoke] transition-colors duration-300">
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
