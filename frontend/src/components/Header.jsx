import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// SVG Logo Component
const Logo = () => (
   <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M22 2L2 26H20L18 42L38 18H20L22 2Z" stroke="#36C5D1" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

);

// SVG Theme Toggle Icon
const ThemeToggleIcon = ({ dark }) =>
    dark ? (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
                d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"
                fill="#36c5d1"
            />
        </svg>
    ) : (
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                fill="#36c5d1"
            />
        </svg>
    );

// SVG Hamburger Menu Icon
const HamburgerIcon = () => {
    const { isDark } = useTheme();
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 12H21M3 6H21M3 18H21"
                stroke={isDark ? "#FFFFFF" : "#1E1E1E"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

// SVG Profile Icon
const ProfileIcon = () => {
    const { isDark } = useTheme();
    return (
        <svg
            width="33"
            height="28"
            viewBox="0 0 33 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M27.5 24.5V22.1667C27.5 20.929 26.9205 19.742 25.8891 18.8668C24.8576 17.9917 23.4587 17.5 22 17.5H11C9.54131 17.5 8.14236 17.9917 7.11091 18.8668C6.07946 19.742 5.5 20.929 5.5 22.1667V24.5M22 8.16667C22 10.744 19.5376 12.8333 16.5 12.8333C13.4624 12.8333 11 10.744 11 8.16667C11 5.58934 13.4624 3.5 16.5 3.5C19.5376 3.5 22 5.58934 22 8.16667Z"
                stroke={isDark ? "#FFFFFF" : "#1E1E1E"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const Header = ({ onToggleSidebar }) => {
    const { isDark, toggleTheme } = useTheme();
    const { auth } = useAuth();
    
    return (
        <header className="w-full flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-900 shadow-md transition-colors duration-200">
            {/* Left: Hamburger Menu, Logo and Name */}
            <div className="flex items-center space-x-3">
                {/* Hamburger Menu Button - Only show when authenticated */}
                {auth?.accessToken && (
                    <button
                        className="flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 focus:outline-none lg:block"
                        onClick={onToggleSidebar}
                        aria-label="Toggle sidebar"
                    >
                        <HamburgerIcon />
                    </button>
                )}
                <Logo />
                <span
                    className="font-serif font-extrabold text-4xl leading-none tracking-normal text-cyan-400 dark:text-cyan-300 transition-colors duration-200"
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
                    className="font-serif font-normal text-sm leading-none text-black dark:text-white hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors duration-200 bg-transparent focus:outline-none"
                >
                    Home
                </Link>
                <Link
                    to="/about"
                    className="font-serif font-normal text-sm leading-none text-black dark:text-white hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors duration-200 bg-transparent focus:outline-none"
                >
                    About
                </Link>
                <Link
                    to="/create-post"
                    className="font-serif font-normal text-sm leading-none text-black dark:text-white hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors duration-200 bg-transparent focus:outline-none"
                >
                    Create
                </Link>
                <button
                    className="flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 focus:outline-none"
                    onClick={toggleTheme}
                    aria-label="Toggle dark mode"
                >
                    <ThemeToggleIcon dark={isDark} />
                </button>
                {auth?.accessToken && (
                    <Link
                        to="/profile"
                        className="flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 focus:outline-none"
                        aria-label="Profile"
                    >
                        <ProfileIcon />
                    </Link>
                )}
                {!auth?.accessToken && (
                    <Link
                        to="/login"
                        className="font-serif font-normal text-sm leading-none text-black dark:text-white hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors duration-200 bg-transparent focus:outline-none"
                    >
                        <button
                            className="font-serif font-normal text-sm leading-none text-black dark:text-white hover:text-white dark:hover:text-black bg-white dark:bg-gray-800 hover:bg-gradient-to-r hover:from-cyan-400 hover:to-purple-500 px-4 py-2 border-2 border-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-padding rounded-lg transition-all duration-200"
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
                )}
            </nav>
        </header>
    );
};

export default Header;