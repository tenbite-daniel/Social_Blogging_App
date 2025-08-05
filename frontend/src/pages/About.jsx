import React, { useState } from "react";
import Header from "../components/Header";

export default function About() {
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState(null);

    const sendPromptToAPI = async (prompt) => {
        try {
            console.log("Sending request...");

            const response = await fetch(`https://blogproject-production-b8ce.up.railway.app/api/generate-blog-from-prompt`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt
                }),
                signal: AbortSignal.timeout(300000) // 5 minutes timeout
            });

            console.log("Response status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Full response data:", data);

            // Handle different possible response formats
            let blogData = null;

            if (data.result) {
                blogData = data.result;
            } else if (data.blog_post) {
                blogData = data.blog_post;
            } else if (typeof data === 'string') {
                // If it's a JSON string, try to parse it
                try {
                    blogData = JSON.parse(data);
                } catch (e) {
                    blogData = { content: data };
                }
            } else {
                blogData = data;
            }

            console.log("Processed blog data:", blogData);

            return {
                success: true,
                data: blogData,
                executionTime: data.execution_time,
                status: data.status || "success"
            };

        } catch (error) {
            console.error("Full error details:", error);
            return {
                success: false,
                error: error.message || "Failed to generate blog post"
            };
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        setIsLoading(true);
        setResponse(null);

        try {
            // Show timeout warning after 30 seconds
            const timeoutWarning = setTimeout(() => {
                setResponse({
                    success: false,
                    error: "This is taking longer than expected. The AI is working hard - please wait..."
                });
            }, 30000);

            const result = await sendPromptToAPI(inputValue);
            clearTimeout(timeoutWarning);

            setResponse(result);

            if (result.success) {
                console.log("Blog generated successfully:", result.data);
            } else {
                console.error("Error:", result.error);
            }
        } catch (error) {
            console.error("Unexpected error:", error);
            setResponse({
                success: false,
                error: "An unexpected error occurred. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    // Helper function to safely get nested properties
    const safeGet = (obj, path, defaultValue = null) => {
        try {
            return path.split('.').reduce((current, key) => current && current[key], obj) || defaultValue;
        } catch {
            return defaultValue;
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
                    Blog Ease AI assistant
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

                {/* Enhanced Response Display */}
                {response && (
                    <div className="w-full mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded border max-h-96 overflow-y-auto">
                        {response.success ? (
                            <div className="text-sm text-gray-900 dark:text-white">
                                <div className="font-semibold mb-2">Blog Generated!</div>

                                {/* Handle different response formats */}
                                {safeGet(response, 'data.seo_title') && (
                                    <div className="mb-1">
                                        <strong>Title:</strong> {response.data.seo_title}
                                    </div>
                                )}

                                {safeGet(response, 'data.title') && (
                                    <div className="mb-1">
                                        <strong>Title:</strong> {response.data.title}
                                    </div>
                                )}

                                {safeGet(response, 'data.meta_description') && (
                                    <div className="mb-1 text-xs">
                                        <strong>Description:</strong> {response.data.meta_description}
                                    </div>
                                )}

                                {safeGet(response, 'data.summary') && (
                                    <div className="mb-2 text-xs">
                                        <strong>Summary:</strong> {response.data.summary}
                                    </div>
                                )}

                                {safeGet(response, 'data.hashtags') && (
                                    <div className="mb-2 text-xs">
                                        <strong>Tags:</strong> {Array.isArray(response.data.hashtags)
                                            ? response.data.hashtags.join(', ')
                                            : response.data.hashtags}
                                    </div>
                                )}

                                {/* Show raw content if available */}
                                {safeGet(response, 'data.full_content') && (
                                    <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded border-l-4 border-gray-400">
                                        <div className="font-semibold text-gray-800 dark:text-gray-200 text-xs mb-1">Full Blog Post:</div>
                                        <div className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                                            {response.data.full_content}
                                        </div>
                                    </div>
                                )}

                                {/* Fallback for other content */}
                                {response.data && typeof response.data === 'string' && (
                                    <div className="mb-2 text-xs">
                                        <strong>Generated Content:</strong>
                                        <div className="mt-1 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                            {response.data.length > 500
                                                ? `${response.data.substring(0, 500)}...\n\n[Scroll to see more]`
                                                : response.data}
                                        </div>
                                    </div>
                                )}

                                {response.executionTime && (
                                    <div className="text-xs text-gray-500 mt-2">
                                        Generated in {response.executionTime.toFixed(1)}s
                                    </div>
                                )}

                                {/* Debug info */}
                                <div className="text-xs text-gray-400 mt-1">
                                    Status: {response.status || 'completed'}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-red-600 dark:text-red-400">
                                <div className="font-semibold mb-1">Error:</div>
                                <div>{response.error}</div>
                                {response.error.includes("taking longer") && (
                                    <div className="text-xs mt-2 text-gray-500">
                                        The AI crew is processing your request. This can take 2-5 minutes.
                                    </div>
                                )}
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