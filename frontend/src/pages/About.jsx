import React from "react";
import Header from "../components/Header";

export default function About() {
return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 relative transition-colors duration-200">
        <Header />
        <div>
            <div className="font-martel font-extrabold text-[48px] leading-none text-center text-[#36c5d1] dark:text-cyan-300 mt-10 mb-6 transition-colors duration-200">
                About Blog Ease
            </div>
            <div className="max-w-3xl mx-auto font-martel font-normal text-[25px] leading-[48px] text-center text-[#222] dark:text-gray-200 transition-colors duration-200">
                Blog Ease is a blogging social app where users can freely post about
                different topics and share their ideas without restrictions. It aims
                to create a safe space where users can gather and discuss topics they
                like or explore new topics across their feed.
            </div>
        </div>
      
        <div
            className="fixed bottom-8 right-8 z-50 border-2 bg-white dark:bg-gray-800 w-[340px] shadow-lg p-5 flex flex-col items-center border-gradient transition-colors duration-200"
            style={{
                borderRadius: "10px",
                borderImage: "linear-gradient(135deg, #36c5d1, #A82ED3) 1",
            }}
        >
            <div className="font-martel font-normal text-base leading-none text-center mb-4 text-gray-900 dark:text-white transition-colors duration-200">
                Blog Ease Ai assistant
            </div>
            <div className="flex flex-row items-center w-full justify-center">
               
                <svg
                    width="29"
                    height="31"
                    viewBox="0 0 29 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                >
                    <ellipse cx="14.5" cy="15.5" rx="14.5" ry="15.5" fill="#D9D9D9" />
                </svg>
                <span className="font-martel font-normal text-base leading-none text-center text-gray-900 dark:text-white transition-colors duration-200">
                    How may I assist you today?
                </span>
            </div>
            <div className="h-4" />
            <div className="flex w-full items-center">
                <input
                    type="text"
                    placeholder="Type message here..."
                    className="font-martel bg-[#F3F0F0] dark:bg-gray-700 rounded border-none outline-none px-3 py-2 font-light text-base leading-none flex-1 mt-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 transition-colors duration-200"
                />
    
                <button
                    className="bg-none border-none ml-2 cursor-pointer flex items-center"
                    aria-label="Send"
                    type="button"
                >
                    <svg width="29" height="31" viewBox="0 0 29 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="14.5" cy="15.5" rx="14.5" ry="15.5" fill="#D9D9D9"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>
);
}
