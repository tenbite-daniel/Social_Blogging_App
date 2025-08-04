import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function Homepage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    const fetchPosts = async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            console.log("Fetching posts from:", `/posts?page=${page}&limit=6`);
            const response = await axiosInstance.get(
                `/posts?page=${page}&limit=6`
            );

            console.log("API Response:", response.data);

            if (response.data.success) {
                console.log("Posts received:", response.data.data);
                console.log("Number of posts:", response.data.data.length);
                setPosts(response.data.data);
                setPagination(response.data.pagination);
            } else {
                setError("Failed to fetch posts");
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            console.error("Error details:", {
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
            });
            setError(err.response?.data?.error || "Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        console.log("Homepage mounted, fetching posts...");
        fetchPosts();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchPosts(newPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const truncateContent = (text, maxLength = 150) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
            <main className="flex-1 flex flex-col items-center justify-start">
                <div
                    className="flex flex-col items-center"
                    style={{ marginTop: 100 }}
                >
                    <h1 className="font-serif font-extrabold text-4xl md:text-5xl leading-none text-center text-cyan-400 dark:text-cyan-300">
                        Welcome to{" "}
                        <span className="whitespace-nowrap">Blog Ease</span>.
                    </h1>

                    <div
                        className="mt-4 text-center font-serif font-extrabold text-xl md:text-2xl"
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

                <div className="mt-12 w-full max-w-7xl px-4">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="font-serif font-extrabold text-xl md:text-3xl text-black dark:text-white transition-colors duration-200">
                            Recent Posts
                        </h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => fetchPosts()}
                                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-200"
                            >
                                Refresh Posts
                            </button>
                            <div className="text-sm text-gray-600 dark:text-gray-300 transition-colors duration-200">
                                {pagination.totalPosts} posts total
                            </div>
                        </div>
                    </div>

                    {console.log(
                        "Current state - Loading:",
                        loading,
                        "Error:",
                        error,
                        "Posts length:",
                        posts.length,
                        "Posts:",
                        posts
                    )}

                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 dark:border-cyan-300"></div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded transition-colors duration-200">
                                {error}
                            </div>
                            <button
                                onClick={() =>
                                    fetchPosts(pagination.currentPage)
                                }
                                className="mt-4 bg-cyan-500 dark:bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-600 dark:hover:bg-cyan-700 transition-colors duration-200"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && posts.length === 0 && (
                        <div className="text-center py-16">
                            <h3 className="text-xl font-serif text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-200">
                                No posts yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors duration-200">
                                Be the first to share your thoughts!
                            </p>
                            <Link
                                to="/create-post"
                                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all"
                            >
                                Create Your First Post
                            </Link>
                        </div>
                    )}

                    {!loading && !error && posts.length > 0 && (
                        <>
                            {console.log(
                                "Rendering posts grid with",
                                posts.length,
                                "posts"
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                {posts.map((post) => (
                                    <div
                                        key={post._id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg dark:hover:shadow-xl transition-all duration-200"
                                    >
                                        <div className="h-48 overflow-hidden bg-gray-100 dark:bg-gray-700">
                                            {post.image &&
                                            post.image.trim() !== "" ? (
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        console.log(
                                                            "Image failed to load:",
                                                            post.image
                                                        );
                                                        e.target.style.display =
                                                            "none";
                                                        e.target.parentNode.innerHTML = `
                                                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-800 dark:to-purple-800">
                                                                <div class="text-center">
                                                                    <svg class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                                    </svg>
                                                                    <p class="text-sm text-gray-500 dark:text-gray-400">Image not available</p>
                                                                </div>
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-purple-100 dark:from-cyan-800 dark:to-purple-800">
                                                    <div className="text-center">
                                                        <svg
                                                            className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-2"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            No image
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-sm font-bold">
                                                        {post.author?.name?.charAt(
                                                            0
                                                        ) ||
                                                            post.author?.username?.charAt(
                                                                0
                                                            ) ||
                                                            "U"}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                                        {post.author?.name ||
                                                            post.author
                                                                ?.username}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                                        {formatDate(
                                                            post.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-2 transition-colors duration-200">
                                                {post.title}
                                            </h3>

                                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 transition-colors duration-200">
                                                {truncateContent(
                                                    post.summary || post.content
                                                )}
                                            </p>

                                            {post.tags &&
                                                post.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {post.tags
                                                            .slice(0, 3)
                                                            .map(
                                                                (
                                                                    tag,
                                                                    index
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs transition-colors duration-200"
                                                                    >
                                                                        #{tag}
                                                                    </span>
                                                                )
                                                            )}
                                                    </div>
                                                )}

                                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {post.likes || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {post.views || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <svg
                                                            className="w-4 h-4"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {post.commentCount || 0}
                                                    </span>
                                                </div>
                                                <Link
                                                    to={`/post/${post._id}`}
                                                    className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-medium transition-colors duration-200"
                                                >
                                                    Read More →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mb-8">
                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.currentPage - 1
                                            )
                                        }
                                        disabled={!pagination.hasPrevPage}
                                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                                            pagination.hasPrevPage
                                                ? "bg-cyan-500 dark:bg-cyan-600 text-white hover:bg-cyan-600 dark:hover:bg-cyan-700"
                                                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {Array.from(
                                            { length: pagination.totalPages },
                                            (_, i) => i + 1
                                        ).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() =>
                                                    handlePageChange(page)
                                                }
                                                className={`px-3 py-2 rounded transition-colors duration-200 ${
                                                    page ===
                                                    pagination.currentPage
                                                        ? "bg-purple-600 dark:bg-purple-700 text-white"
                                                        : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.currentPage + 1
                                            )
                                        }
                                        disabled={!pagination.hasNextPage}
                                        className={`px-4 py-2 rounded transition-colors duration-200 ${
                                            pagination.hasNextPage
                                                ? "bg-cyan-500 dark:bg-cyan-600 text-white hover:bg-cyan-600 dark:hover:bg-cyan-700"
                                                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
