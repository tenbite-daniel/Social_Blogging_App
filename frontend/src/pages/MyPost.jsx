import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import Footer from "../components/Footer";
import axiosInstance from "../api/axiosInstance";

const MyPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleteModal, setDeleteModal] = useState({
        show: false,
        postId: null,
        postTitle: "",
    });
    const { auth } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyPosts();
    }, []);

    const fetchMyPosts = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axiosInstance.get("/posts/my-posts");

            if (response.data.success) {
                setPosts(response.data.data || []);
            } else {
                setError("Failed to fetch posts");
            }
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError("Failed to load your posts");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (postId) => {
        try {
            const response = await axiosInstance.delete(`/posts/${postId}`);

            if (response.data.success) {
                setPosts(posts.filter((post) => post._id !== postId));
                setDeleteModal({ show: false, postId: null, postTitle: "" });
            } else {
                setError("Failed to delete post");
            }
        } catch (err) {
            console.error("Error deleting post:", err);
            setError("Failed to delete post");
        }
    };

    const handleEdit = (post) => {
        navigate("/create-post", { state: { editPost: post } });
    };

    const openDeleteModal = (postId, postTitle) => {
        setDeleteModal({ show: true, postId, postTitle });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ show: false, postId: null, postTitle: "" });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
            <main className="pt-8 pb-16 px-4 md:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="text-center mb-8">
                        <h1
                            className="text-gray-900 dark:text-white transition-colors duration-200 mt-5"
                            style={{
                                fontFamily: "Martel, serif",
                                fontWeight: 700,
                                fontSize: "32px",
                                letterSpacing: "0%",
                            }}
                        >
                            My Posts
                        </h1>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-300">
                                Loading your posts...
                            </p>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                No posts yet
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Start sharing your thoughts with the world!
                            </p>
                            <button
                                onClick={() => navigate("/create-post")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
                            >
                                Create Your First Post
                            </button>
                        </div>
                    ) : (
                        <section>
                            <button
                                onClick={() => navigate("/create-post")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200 mb-5"
                            >
                                Create Post
                            </button>
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div
                                    className="grid grid-cols-5 gap-4 p-4 text-center font-semibold text-gray-700 dark:text-gray-400 bg-[#ECEAEA] dark:bg-[#2D3748]"
                                    // style={{ backgroundColor: "" }}
                                >
                                    <div>DATE UPDATED</div>
                                    <div>POST IMAGE</div>
                                    <div>POST TITLE</div>
                                    <div>DELETE</div>
                                    <div>EDIT</div>
                                </div>

                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {posts.map((post) => (
                                        <div
                                            key={post._id}
                                            className="grid grid-cols-5 gap-4 p-4 items-center bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                        >
                                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                                {formatDate(
                                                    post.updatedAt ||
                                                        post.createdAt
                                                )}
                                            </div>

                                            <div className="flex justify-center">
                                                {post.image ? (
                                                    <img
                                                        src={post.image}
                                                        alt={post.title}
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center dark:bg-gray-600">
                                                        <span className="text-gray-400 text-xs dark:text-gray-300">
                                                            No Image
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-center">
                                                <h3
                                                    className="font-medium text-gray-900 truncate max-w-xs mx-auto dark:text-gray-100"
                                                    title={post.title}
                                                >
                                                    {post.title}
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {post.likes || 0} likes •{" "}
                                                    {post.views || 0} views
                                                </p>
                                            </div>

                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        openDeleteModal(
                                                            post._id,
                                                            post.title
                                                        )
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(post)
                                                    }
                                                    className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Modal */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Delete Post
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete "
                            {deleteModal.postTitle}"? This action cannot be
                            undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-200 dark:text-gray-30 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteModal.postId)}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MyPost;
