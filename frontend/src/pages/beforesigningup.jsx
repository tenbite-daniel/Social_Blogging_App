import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";

// Your posts data
const posts = [
    {
        img: "/images/image1.jpg",
        author: "R.J Miller",
    },
    {
        img: "/images/image2.jpg",
        author: "R.J Miller",
    },
    {
        img: "/images/image3.jpg",
        author: "R.J Miller",
    },
];

export default function BeforeSigningUp() {
    const navigate = useNavigate();

    const handleViewAllPosts = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-start">
                <div
                    className="flex flex-col items-center"
                    style={{ marginTop: 100 }}
                >
                    <h1 className="font-serif font-extrabold text-5xl leading-none text-center text-cyan-400 dark:text-cyan-300 transition-colors duration-200">
                        Welcome to Blog Ease.
                    </h1>

                    <div
                        className="mt-4 text-center font-serif font-extrabold text-2xl"
                        style={{
                            background:
                                "linear-gradient(90deg, #0A8F9A, #8511AD)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        Bring your ideas to life anytime, anywhere
                    </div>
                </div>

                <div className="mt-12 w-full flex flex-col items-center">
                    <h2 className="font-serif font-extrabold text-2xl text-black">
                        Posts
                    </h2>

                    <div className="mt-8 flex flex-col itmes-center lg:flex-row gap-8 justify-center">
                        {posts.map((post, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col items-center"
                            >
                                <div className="relative">
                                    <img
                                        src={post.img}
                                        alt="Recent Post"
                                        className="w-[260px] h-[160px] object-cover rounded-lg shadow-md"
                                    />
                                </div>

                                <div
                                    className="relative bg-white dark:bg-gray-800 px-6 py-4 rounded shadow font-serif text-xl flex flex-col justify-between -mt-6 transition-colors duration-200"
                                    style={{
                                        width: 260,
                                        minHeight: 90,
                                        zIndex: 1,
                                    }}
                                >
                                    <span className="text-gray-900 dark:text-white transition-colors duration-200">
                                        Paying it forward
                                    </span>
                                    <span className="text-base text-gray-600 dark:text-gray-300 mt-2 transition-colors duration-200">
                                        Discover how small acts of kindness can
                                        make a big difference in your community.
                                    </span>
                                    <div className="absolute flex items-center gap-2 right-4 bottom-3">
                                        <svg
                                            width="29"
                                            height="27"
                                            viewBox="0 0 29 27"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <ellipse
                                                cx="14.5"
                                                cy="13.5"
                                                rx="14.5"
                                                ry="13.5"
                                                fill="url(#paint0_linear_1_848)"
                                            />
                                            <defs>
                                                <linearGradient
                                                    id="paint0_linear_1_848"
                                                    x1="14.5"
                                                    y1="0"
                                                    x2="14.5"
                                                    y2="27"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop
                                                        stopColor="#36C5D1"
                                                        stopOpacity="0.67"
                                                    />
                                                    <stop
                                                        offset="1"
                                                        stopColor="#A82ED3"
                                                        stopOpacity="0.68"
                                                    />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <span className="font-serif text-sm text-black dark:text-white transition-colors duration-200">
                                            {post.author}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ height: 70 }} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-1">
                        <button
                            className="font-serif font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors duration-200"
                            onClick={handleViewAllPosts}
                        >
                            View all posts
                        </button>
                        <p className="text-sm text-gray-600 dark:text-gray-400 my-2">
                            Sign in to access all posts and create your own
                        </p>
                    </div>
                    <Footer />
                </div>
            </main>
        </div>
    );
}
