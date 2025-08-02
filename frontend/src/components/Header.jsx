import React, { useState } from "react";
import { Link } from "react-router-dom";

// SVG Logo Component
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

// SVG for Dark/Light Mode Toggle
const ThemeToggleIcon = ({ dark }) =>
    dark ? (
        <svg
            width="30"
            height="26"
            viewBox="0 0 30 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_1_844)">
                <path
                    d="M15 1.08333V3.25M15 22.75V24.9167M5.275 4.57166L7.05 6.11M22.95 19.89L24.725 21.4283M1.25 13H3.75M26.25 13H28.75M5.275 21.4283L7.05 19.89M22.95 6.11L24.725 4.57166M21.25 13C21.25 15.9915 18.4518 18.4167 15 18.4167C11.5482 18.4167 8.75 15.9915 8.75 13C8.75 10.0085 11.5482 7.58333 15 7.58333C18.4518 7.58333 21.25 10.0085 21.25 13Z"
                    stroke="#1E1E1E"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_1_844">
                    <rect width="30" height="26" fill="white" />
                </clipPath>
            </defs>
        </svg>
    ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                fill="#36c5d1"
            />
        </svg>
    );

// SVG Profile Icon
const ProfileIcon = () => (
    <svg
        width="33"
        height="28"
        viewBox="0 0 33 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M27.5 24.5V22.1667C27.5 20.929 26.9205 19.742 25.8891 18.8668C24.8576 17.9917 23.4587 17.5 22 17.5H11C9.54131 17.5 8.14236 17.9917 7.11091 18.8668C6.07946 19.742 5.5 20.929 5.5 22.1667V24.5M22 8.16667C22 10.744 19.5376 12.8333 16.5 12.8333C13.4624 12.8333 11 10.744 11 8.16667C11 5.58934 13.4624 3.5 16.5 3.5C19.5376 3.5 22 5.58934 22 8.16667Z"
            stroke="#1E1E1E"
            stroke-width="4"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    </svg>
);

const Header = () => {
    const [dark, setDark] = useState(false);

    return (
        <header className="w-full flex justify-between items-center px-8 py-4 bg-white shadow-md">
            {/* Left: Logo and Name */}
            <div className="flex items-center space-x-3">
                <Logo />
                <span
                    className="font-serif font-extrabold text-4xl leading-none tracking-normal  text-cyan-400"
                    style={{
                        display: "inline-block",
                    }}
                >
                    Blog EASE
                </span>
            </div>

            {/* Right: Navigation */}
            <nav className="flex items-center space-x-6">
                <Link
                    to="/"
                    className="font-serif font-normal text-sm leading-none text-black hover:text-cyan-400 transition-colors duration-200 bg-transparent focus:outline-none"
                >
                    Home
                </Link>
                <a
                    href="/about"
                    className="font-serif font-normal text-sm leading-none text-black hover:text-cyan-400 transition-colors duration-200 bg-transparent focus:outline-none"
                >
                    About
                </a>
                <button className="font-serif font-normal text-sm leading-none text-black hover:text-cyan-400 transition-colors duration-200 bg-transparent focus:outline-none">
                    Create
                </button>
                <button
                    className="flex items-center justify-center bg-transparent hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200 focus:outline-none"
                    onClick={() => setDark((d) => !d)}
                    aria-label="Toggle dark mode"
                >
                    <ThemeToggleIcon dark={dark} />
                </button>
                <button
                    className="flex items-center justify-center bg-transparent p-2 rounded-lg focus:outline-none"
                    aria-label="Profile"
                >
                    <ProfileIcon />
                </button>
                <Link
                    to="/login"
                    className="font-serif font-normal text-sm leading-none text-black hover:text-cyan-400 transition-colors duration-200 bg-transparent focus:outline-none"
                >
                    <button
                        className="font-serif font-normal text-sm leading-none text-black hover:text-white bg-white hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500 px-4 py-2 border-2 border-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-padding rounded-lg transition-all duration-200"
                        style={{
                            background: "white",
                            backgroundImage:
                                "linear-gradient(white, white), linear-gradient(90deg, #36c5d1, #A82ED3)",
                            backgroundOrigin: "border-box",
                            backgroundClip: "padding-box, border-box",
                        }}
                    >
                        Sign in
                    </button>
                </Link>
            </nav>
        </header>
    );
};

export default Header;
