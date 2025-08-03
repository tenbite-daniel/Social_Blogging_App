import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import axiosInstance from '../api/axiosInstance';

const SingleBlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);
    const [likedBy, setLikedBy] = useState([]);

    // Fetch post data and increment views
    useEffect(() => {
        if (id) {
            fetchPost();
        }
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            setError('');
            
            console.log('Fetching post with ID:', id);
            
            const response = await axiosInstance.get(`/posts/${id}`);
            
            console.log('API Response:', response.data);
            
            if (response.data.success) {
                const postData = response.data.data;
                console.log('Post data received:', postData);
                
                setPost(postData);
                setComments(postData.comments || []);
                setLikes(postData.likes || 0);
                setViews(postData.views || 0);
                setLikedBy(postData.likedBy || []);
                setLiked(postData.isLikedByCurrentUser || false);
              
            } else {
                console.log('API returned success: false');
                setError('Post not found');
            }
        } catch (err) {
            console.error('Error fetching post:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                statusText: err.response?.statusText
            });
            
            if (err.response?.status === 404) {
                setError('Post not found');
            } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
                setError('Cannot connect to server. Please check if the backend is running.');
            } else {
                setError(`Failed to load post: ${err.response?.data?.error || err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!auth?.accessToken) {
            navigate('/login');
            return;
        }

        try {
            const response = await axiosInstance.post(`/posts/${id}/like`);
            console.log('Like response:', response.data);
            if (response.data.success) {
                // Update states with the response from backend
                setLiked(response.data.isLiked);
                setLikes(response.data.likes);
                setLikedBy(response.data.likedBy || []);
            }
        } catch (err) {
            console.error('Error liking post:', err);
            console.error('Like error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        
        if (!auth?.accessToken) {
            navigate('/login');
            return;
        }

        if (!newComment.trim()) {
            return;
        }

        try {
            setCommentLoading(true);
            console.log('Submitting comment:', newComment.trim());
            
            const response = await axiosInstance.post(`/posts/${id}/comments`, {
                content: newComment.trim()
            });
            
            console.log('Comment response:', response.data);

            if (response.data.success) {
               
                const newCommentData = {
                    _id: response.data.data._id,
                    content: newComment.trim(),
                    author: {
                        username: auth.user?.username || 'Anonymous',
                        name: auth.user?.name || auth.user?.username || 'Anonymous'
                    },
                    createdAt: new Date().toISOString()
                };
                
                setComments(prev => [...prev, newCommentData]);
                setNewComment('');
            }
        } catch (err) {
            console.error('Error adding comment:', err);
            console.error('Comment error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setError(`Failed to add comment: ${err.response?.data?.error || err.message}`);
        } finally {
            setCommentLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    console.log('SingleBlogPost render - State:', { loading, error, post, id, auth });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
                <Header />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
                <Header />
                <div className="max-w-4xl mx-auto px-6 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            {error || 'Post not found'}
                        </h1>
                        <button
                            onClick={() => navigate('/home')}
                            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
            
            
            <main className="max-w-4xl mx-auto px-6 py-8">
              
                <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-200">
                    {post.title}
                </h1>

               
                <div className="flex items-center gap-4 mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        {post.author?.avatar ? (
                            <img
                                src={post.author.avatar}
                                alt={post.author.name || post.author.username}
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentNode.innerHTML = `
                                        <span class="text-white text-lg font-bold">
                                            ${(post.author?.name?.charAt(0) || post.author?.username?.charAt(0) || 'A').toUpperCase()}
                                        </span>
                                    `;
                                }}
                            />
                        ) : (
                            <span className="text-white text-lg font-bold">
                                {(post.author?.name?.charAt(0) || post.author?.username?.charAt(0) || 'A').toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">
                            {post.author?.name || post.author?.username || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                            @{post.author?.username || 'anonymous'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 transition-colors duration-200">
                            Published on {formatDate(post.createdAt)}
                        </p>
                    </div>
                </div>

              
                {post.image && (
                    <div className="mb-6">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                    </div>
                )}

              
                <hr className="border-black dark:border-white mb-6 transition-colors duration-200" />

              
                <div className="prose prose-lg max-w-none mb-8">
                    <div className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap transition-colors duration-200">
                        {post.content}
                    </div>
                </div>

               
                <div className="flex items-center space-x-6 mb-8">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 transition-colors duration-200 ${
                            liked 
                                ? 'text-red-500 hover:text-red-600' 
                                : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
                        }`}
                        disabled={!auth?.accessToken}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill={liked ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        <span>{likes}</span>
                    </button>

                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 transition-colors duration-200">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>{views} views</span>
                    </div>
                </div>

                {/* Liked by Section */}
                {likedBy && likedBy.length > 0 && (
                    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-red-500"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span>
                                Liked by{' '}
                                {likedBy.slice(0, 3).map((user, index) => (
                                    <span key={user._id}>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {user.name || user.username}
                                        </span>
                                        {index < Math.min(2, likedBy.length - 1) && ', '}
                                    </span>
                                ))}
                                {likedBy.length > 3 && (
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {' '}and {likedBy.length - 3} others
                                    </span>
                                )}
                            </span>
                        </div>
                    </div>
                )}

                {/* Comments Section */}
                <div className="border-2 border-[#365cd1] rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
                        Comments ({comments.length})
                    </h3>

                   
                    {auth?.accessToken ? (
                        <form onSubmit={handleCommentSubmit} className="mb-6">
                            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-[#F1EFEF] dark:bg-gray-700 transition-colors duration-200">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full bg-transparent text-black dark:text-white placeholder-black dark:placeholder-gray-300 resize-none outline-none transition-colors duration-200"
                                    rows="3"
                                    disabled={commentLoading}
                                />
                            </div>
                            <div className="flex justify-end mt-3">
                                <button
                                    type="submit"
                                    disabled={commentLoading || !newComment.trim()}
                                    className="px-6 py-2 border-2 border-[#36c5d1] text-black dark:text-white bg-transparent rounded-lg hover:bg-[#36c5d1] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {commentLoading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg transition-colors duration-200">
                            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
                                Please{' '}
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-cyan-500 hover:text-cyan-600 underline"
                                >
                                    log in
                                </button>{' '}
                                to add a comment.
                            </p>
                        </div>
                    )}

                  
                    {comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <div key={comment._id} className="border-b border-gray-200 dark:border-gray-600 pb-4 last:border-b-0 transition-colors duration-200">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">
                                                {comment.author?.name?.charAt(0) || comment.author?.username?.charAt(0) || 'A'}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-gray-800 dark:text-gray-200 transition-colors duration-200">
                                            {comment.author?.name || comment.author?.username || 'Anonymous'}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-200">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 ml-10 transition-colors duration-200">
                                        {comment.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4 transition-colors duration-200">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SingleBlogPost;
