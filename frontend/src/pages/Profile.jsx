import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [username, setUsername] = useState("user346");
    const [email, setEmail] = useState("user346@gmail.com");
    const [showSignOutPopup, setShowSignOutPopup] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gradient-to-b from-[#fdf7f7] to-[#c6f7f7]">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-start pt-12">
            
                <h1 className="font-martel font-bold text-2xl text-black text-center mb-6">
                    Profile
                </h1>

        
                <div className="flex justify-center mb-8">
                    <svg width="156" height="130" viewBox="0 0 156 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M130 113.75V102.917C130 97.1703 127.261 91.6593 122.385 87.596C117.509 83.5327 110.896 81.25 104 81.25H52C45.1044 81.25 38.4912 83.5327 33.6152 87.596C28.7393 91.6593 26 97.1703 26 102.917V113.75M104 37.9167C104 49.8828 92.3594 59.5833 78 59.5833C63.6406 59.5833 52 49.8828 52 37.9167C52 25.9505 63.6406 16.25 78 16.25C92.3594 16.25 104 25.9505 104 37.9167Z" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>

            
                <form className="flex flex-col items-center w-full max-w-[495px]">
                    {/* Username Input */}
                    <div className="w-full h-[43px] rounded-[10px] bg-white flex items-center pl-5 mb-4 box-border">
                        <input
                            type="text"
                            className="font-martel font-light text-sm text-black bg-transparent outline-none w-full"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </div>

                
                    <div className="w-full h-[43px] rounded-[10px] bg-white flex items-center pl-5 mb-4 box-border">
                        <input
                            type="email"
                            className="font-martel font-light text-sm text-black bg-transparent outline-none w-full"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full h-[43px] rounded-[10px] border-4 border-[#36c5d1] bg-white flex items-center justify-center mb-4 box-border cursor-pointer"
                    >
                        <span className="font-martel font-bold text-sm text-black">
                            Update
                        </span>
                    </button>
                </form>

        
                <button
                    className="w-[495px] h-[43px] rounded-[10px] bg-gradient-to-r from-[#36c5d1] to-[#A82ED3] flex items-center justify-center mb-8 box-border cursor-pointer"
                >
                    <span className="font-martel font-bold text-sm text-white">
                        Create a post
                    </span>
                </button>

            
                <div className="w-[495px] flex justify-between items-center mt-2">
                    <button
                        className="font-martel font-semibold text-sm text-[#E83C3C] cursor-pointer bg-transparent border-none p-0"
                        type="button"
                    >
                        Delete account
                    </button>
                    <button
                        className="font-martel font-semibold text-sm text-[#E83C3C] cursor-pointer bg-transparent border-none p-0"
                        type="button"
                        onClick={() => setShowSignOutPopup(true)}
                    >
                        Sign Out
                    </button>
                </div>
            </main>
            <Footer />

    
            {showSignOutPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div
                        className="relative bg-white rounded-[16px] shadow-lg flex flex-col"
                        style={{
                            width: 420,
                            padding: "40px 32px 32px 32px",
                            boxSizing: "border-box",
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "Calibri, Arial, sans-serif",
                                fontWeight: 400,
                                fontStyle: "normal",
                                fontSize: 24,
                                lineHeight: "100%",
                                letterSpacing: 0,
                                color: "#1E1E1E",
                                textAlign: "center",
                            }}
                        >
                            Are you sure you want to sign out?
                        </div>
                        <div style={{ height: 45 }} />
                        <div className="flex w-full justify-between items-end">
                            <button
                                type="button"
                                onClick={() => setShowSignOutPopup(false)}
                                style={{
                                    width: 93,
                                    height: 39,
                                    borderRadius: 10,
                                    borderWidth: 3,
                                    borderStyle: "solid",
                                    borderColor: "#36c5d1 #A82ED3 #A82ED3 #36c5d1",
                                    background: "#fff",
                                    fontFamily: "Calibri, Arial, sans-serif",
                                    fontWeight: 400,
                                    fontSize: 16,
                                    color: "#1E1E1E",
                                    cursor: "pointer",
                                }}
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                style={{
                                    width: 110,
                                    height: 39,
                                    borderRadius: 10,
                                    background: "#E83C3C",
                                    color: "#fff",
                                    fontFamily: "Martel, serif",
                                    fontWeight: 700,
                                    fontSize: 14,
                                    lineHeight: "100%",
                                    letterSpacing: 0,
                                    border: "none",
                                    cursor: "pointer",
                                }}
                                onClick={() => {
                                    setShowSignOutPopup(false);
                                    navigate("/signup");
                                }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
