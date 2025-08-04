import React, { useState } from "react";
import Header from "../components/Header";

export default function About() {
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const sendPromptToAPI = async (prompt) => {
        const API_BASE_URL = "https://blogproject-production-b8ce.up.railway.app";

        try {
            const response = await fetch(`https://blogproject-production-b8ce.up.railway.app/api/generate-blog-from-prompt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data.result,
                metadata: data.metadata,
                executionTime: data.execution_time,
                status: data.status
            };

        } catch (error) {
            console.error("Error sending prompt to API:", error);
            return {
                success: false,
                error: error.message || "Failed to generate blog post"
            };
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        setIsLoading(true);
        const result = await sendPromptToAPI(inputValue);

        if (result.success) {
            setResponse(result);
            console.log("Blog generated:", result.data);
        } else {
            setResponse({ success: false, error: result.error });
            console.error("Error:", result.error);
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

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
                        {isLoading ? "Generating blog post..." : "How may I assist you today?"}
                    </span>
                </div>
                <div className="h-4" />

                {/* Response Display */}
                {response && (
                    <div className="w-full mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded border max-h-40 overflow-y-auto">
                        {response.success ? (
                            <div className="text-sm text-gray-900 dark:text-white">
                                <div className="font-semibold mb-2">Blog Generated!</div>
                                {response.data.seo_title && (
                                    <div className="mb-1"><strong>Title:</strong> {response.data.seo_title}</div>
                                )}
                                {response.executionTime && (
                                    <div className="text-xs text-gray-500">Generated in {response.executionTime.toFixed(1)}s</div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-red-600 dark:text-red-400">
                                Error: {response.error}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex w-full items-center">
                    <input
                        type="text"
                        placeholder="Type message here..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="font-martel bg-[#F3F0F0] dark:bg-gray-700 rounded border-none outline-none px-3 py-2 font-light text-base leading-none flex-1 mt-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300 transition-colors duration-200 disabled:opacity-50"
                    />

                    <button
                        className="bg-none border-none ml-2 cursor-pointer flex items-center disabled:opacity-50"
                        aria-label="Send"
                        type="button"
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputValue.trim()}
                    >
                        <svg width="29" height="31" viewBox="0 0 29 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="14.5" cy="15.5" rx="14.5" ry="15.5" fill={isLoading ? "#999" : "#D9D9D9"} />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}