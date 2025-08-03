import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axiosInstance";

const Profile = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [showSignOutPopup, setShowSignOutPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [userId, setUserId] = useState("");
    
    const navigate = useNavigate();
    const { auth, setAuth, logout } = useAuth();

    // Fetch user profile data on component mount
    useEffect(() => {
        if (auth?.user) {
            // If we already have user data from auth context, use it
            setUserId(auth.user._id || "");
            setUsername(auth.user.username || "");
            setEmail(auth.user.email || "");
            setName(auth.user.name || "");
            setAvatar(auth.user.avatar || "");
            
            // Still try to fetch fresh data from server
            fetchUserProfile();
        } else {
            // If no user data in context, try to fetch from server
            fetchUserProfile();
        }
    }, [auth]);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/auth/profile');
            const userData = response.data.user;
            setUserId(userData._id);
            setUsername(userData.username || "");
            setEmail(userData.email || "");
            setName(userData.name || "");
            setAvatar(userData.avatar || "");
            setError(""); // Clear any previous errors
        } catch (error) {
            console.error('Error fetching profile:', error);
            // If we have auth data, use it and don't show error
            if (auth?.user) {
                console.log('Using auth context data instead');
                setError(""); // Don't show error if we have fallback data
            } else {
                setError("Failed to load profile data. Please try logging in again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setMessage("");
        setError("");

        try {
            const updateData = {
                username,
                email,
                name,
                avatar
            };

            console.log('Sending update data:', updateData);
            console.log('Auth token exists:', !!auth?.accessToken);

            const response = await axios.put('/auth/profile', updateData);
            console.log('Update response:', response.data);
            
            setMessage("Profile updated successfully!");
            
            // Update the auth context with new user data
            if (response.data.user) {
                setAuth({
                    ...auth,
                    user: response.data.user
                });
            }
            
            // Clear message after 3 seconds
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error('Update error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            
            const errorMessage = error.response?.data?.error || 
                                error.response?.data?.details || 
                                `Failed to update profile: ${error.message}`;
            setError(errorMessage);
            
            // Clear error after 5 seconds
            setTimeout(() => setError(""), 5000);
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleSignOut = () => {
        logout();
        setShowSignOutPopup(false);
        navigate("/login");
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await axios.delete('/auth/profile');
                logout();
                navigate("/register");
            } catch (error) {
                console.error('Error deleting account:', error);
                setError("Failed to delete account");
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#fdf7f7] to-[#c6f7f7]">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-start pt-12">
            
                <h1 className="font-martel font-bold text-2xl text-black text-center mb-6">
                    Profile
                </h1>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-gray-600">Loading profile...</div>
                    </div>
                ) : (
                    <>
                        {/* Success Message */}
                        {message && (
                            <div className="w-full max-w-[495px] mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                                {message}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="w-full max-w-[495px] mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Profile Picture */}
                        <div className="flex justify-center mb-8">
                            {avatar ? (
                                <img 
                                    src={avatar} 
                                    alt="Profile" 
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
                                />
                            ) : (
                                <svg width="156" height="130" viewBox="0 0 156 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M130 113.75V102.917C130 97.1703 127.261 91.6593 122.385 87.596C117.509 83.5327 110.896 81.25 104 81.25H52C45.1044 81.25 38.4912 83.5327 33.6152 87.596C28.7393 91.6593 26 97.1703 26 102.917V113.75M104 37.9167C104 49.8828 92.3594 59.5833 78 59.5833C63.6406 59.5833 52 49.8828 52 37.9167C52 25.9505 63.6406 16.25 78 16.25C92.3594 16.25 104 25.9505 104 37.9167Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </div>

                        {/* Profile Form */}
                        <form className="flex flex-col items-center w-full max-w-[495px]" onSubmit={handleUpdateProfile}>
                            {/* Full Name */}
                            <div className="w-full h-[43px] rounded-[10px] bg-white flex items-center pl-5 mb-4 box-border">
                                <input
                                    type="text"
                                    className="font-martel font-light text-sm text-black bg-transparent outline-none w-full"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Full Name"
                                    disabled={updateLoading}
                                />
                            </div>

                            {/* Username */}
                            <div className="w-full h-[43px] rounded-[10px] bg-white flex items-center pl-5 mb-4 box-border">
                                <input
                                    type="text"
                                    className="font-martel font-light text-sm text-black bg-transparent outline-none w-full"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="Username"
                                    disabled={updateLoading}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="w-full h-[43px] rounded-[10px] bg-white flex items-center pl-5 mb-4 box-border">
                                <input
                                    type="email"
                                    className="font-martel font-light text-sm text-black bg-transparent outline-none w-full"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email"
                                    disabled={updateLoading}
                                    required
                                />
                            </div>

                            {/* Avatar URL */}
                            <div className="w-full h-[43px] rounded-[10px] bg-white flex items-center pl-5 mb-4 box-border">
                                <input
                                    type="url"
                                    className="font-martel font-light text-sm text-black bg-transparent outline-none w-full"
                                    value={avatar}
                                    onChange={e => setAvatar(e.target.value)}
                                    placeholder="Avatar URL (optional)"
                                    disabled={updateLoading}
                                />
                            </div>

                            {/* Update Button */}
                            <button
                                type="submit"
                                className="w-full h-[43px] rounded-[10px] border-4 border-[#36c5d1] bg-white flex items-center justify-center mb-4 box-border cursor-pointer hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={updateLoading}
                            >
                                <span className="font-martel font-bold text-sm text-black">
                                    {updateLoading ? "Updating..." : "Update Profile"}
                                </span>
                            </button>
                        </form>

                        {/* Create Post Button */}
                        <button
                            className="w-[495px] h-[43px] rounded-[10px] bg-gradient-to-r from-[#36c5d1] to-[#A82ED3] flex items-center justify-center mb-8 box-border cursor-pointer hover:opacity-90 transition-opacity duration-200"
                            onClick={() => navigate("/create-post")}
                        >
                            <span className="font-martel font-bold text-sm text-white">
                                Create a post
                            </span>
                        </button>

                        {/* Action Buttons */}
                        <div className="w-[495px] flex justify-between items-center mt-2">
                            <button
                                className="font-martel font-semibold text-sm text-[#E83C3C] cursor-pointer bg-transparent border-none p-0 hover:text-red-700 transition-colors duration-200"
                                type="button"
                                onClick={handleDeleteAccount}
                            >
                                Delete account
                            </button>
                            <button
                                className="font-martel font-semibold text-sm text-[#E83C3C] cursor-pointer bg-transparent border-none p-0 hover:text-red-700 transition-colors duration-200"
                                type="button"
                                onClick={() => setShowSignOutPopup(true)}
                            >
                                Sign Out
                            </button>
                        </div>
                    </>
                )}
            </main>
                {showSignOutPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
                            <p className="mb-4 font-martel text-lg text-black">Are you sure you want to sign out?</p>
                            <div className="flex gap-4">
                                <button
                                    className="px-4 py-2 rounded bg-[#36c5d1] text-white font-bold hover:bg-opacity-90 transition-colors duration-200"
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </button>
                                <button
                                    className="px-4 py-2 rounded bg-gray-300 text-black font-bold"
                                    onClick={() => setShowSignOutPopup(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            <Footer />
        </div>
    );
};

export default Profile;
