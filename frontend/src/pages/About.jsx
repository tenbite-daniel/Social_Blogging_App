import React, { useState } from "react";

const Header = () => (
    <div className="w-full h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Blog Ease</h1>
    </div>
);

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

            let blogData = null;

            if (data.result) {
                blogData = parseContentData(data.result);
            } else if (data.blog_post) {
                blogData = parseContentData(data.blog_post);
            } else if (typeof data === 'string') {
                blogData = parseContentData(data);
            } else {
                blogData = parseContentData(data);
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

    const parseContentData = (content) => {
        if (typeof content === 'object' && content !== null) {
            return content;
        }

        if (typeof content === 'string') {
            try {
                let cleanContent = content;

                if (content.includes('```json')) {
                    cleanContent = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
                }

                const parsed = JSON.parse(cleanContent);
                return parsed;

            } catch (e) {
                console.log("Could not parse as JSON, treating as plain text:", e);
                return { content: content };
            }
        }

        return content;
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        setIsLoading(true);
        setResponse(null);

        try {
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

    const safeGet = (obj, path, defaultValue = null) => {
        try {
            return path.split('.').reduce((current, key) => current && current[key], obj) || defaultValue;
        } catch {
            return defaultValue;
        }
    };

    const formatHashtags = (hashtags) => {
        if (Array.isArray(hashtags)) {
            return hashtags.join(' ');
        }
        if (typeof hashtags === 'string') {
            if (hashtags.includes('#')) {
                return hashtags;
            }
            try {
                const parsed = JSON.parse(hashtags);
                if (Array.isArray(parsed)) {
                    return parsed.join(' ');
                }
            } catch (e) {
                return hashtags;
            }
        }
        return hashtags;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 relative transition-colors duration-200">
            <Header />
            <div>
                <div className="font-bold text-5xl text-center text-[#36c5d1] dark:text-cyan-300 mt-10 mb-6 transition-colors duration-200">
                    About Blog Ease
                </div>
                <div className="max-w-3xl mx-auto text-2xl leading-relaxed text-center text-[#222] dark:text-gray-200 transition-colors duration-200 px-4">
                    Blog Ease is a blogging social app where users can freely post about
                    different topics and share their ideas without restrictions. It aims
                    to create a safe space where users can gather and discuss topics they
                    like or explore new topics across their feed.
                </div>
            </div>

            <div
                className="fixed bottom-8 right-8 z-50 border-2 bg-white dark:bg-gray-800 w-[400px] shadow-xl p-6 flex flex-col items-center border-gradient transition-colors duration-200"
                style={{
                    borderRadius: "12px",
                    borderImage: "linear-gradient(135deg, #36c5d1, #A82ED3) 1",
                }}
            >
                <div className="font-semibold text-lg text-center mb-4 text-gray-900 dark:text-white transition-colors duration-200">
                    Blog Ease AI Assistant
                </div>
                <div className="flex flex-row items-center w-full justify-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#36c5d1] to-[#A82ED3] rounded-full mr-3 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AI</span>
                    </div>
                    <span className="text-base text-gray-900 dark:text-white transition-colors duration-200">
                        {isLoading ? "Generating blog post..." : "How may I assist you today?"}
                    </span>
                </div>

                {response && (
                    <div className="w-full mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border max-h-80 overflow-y-auto">
                        {response.success ? (
                            <div className="text-sm text-gray-900 dark:text-white space-y-3">
                                <div className="flex items-center text-green-600 dark:text-green-400 font-semibold mb-3">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Blog Generated Successfully!
                                </div>

                                {(safeGet(response, 'data.title') || safeGet(response, 'data.seo_title')) && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                        <div className="font-semibold text-blue-800 dark:text-blue-200 mb-1">Title:</div>
                                        <div className="text-gray-800 dark:text-gray-200 font-medium">
                                            {safeGet(response, 'data.title') || safeGet(response, 'data.seo_title')}
                                        </div>
                                    </div>
                                )}

                                {safeGet(response, 'data.meta_description') && (
                                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                        <div className="font-semibold text-green-800 dark:text-green-200 mb-1">Description:</div>
                                        <div className="text-gray-700 dark:text-gray-300 text-sm">
                                            {response.data.meta_description}
                                        </div>
                                    </div>
                                )}

                                {safeGet(response, 'data.summary') && (
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                        <div className="font-semibold text-purple-800 dark:text-purple-200 mb-1">Summary:</div>
                                        <div className="text-gray-700 dark:text-gray-300 text-sm">
                                            {response.data.summary}
                                        </div>
                                    </div>
                                )}

                                {safeGet(response, 'data.hashtags') && (
                                    <div className="bg-cyan-50 dark:bg-cyan-900/20 p-3 rounded-lg">
                                        <div className="font-semibold text-cyan-800 dark:text-cyan-200 mb-2">Tags:</div>
                                        <div className="flex flex-wrap gap-1">
                                            {formatHashtags(response.data.hashtags).split(' ').map((tag, index) => (
                                                tag.trim() && (
                                                    <span key={index} className="inline-block bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 px-2 py-1 rounded-full text-xs">
                                                        {tag.trim()}
                                                    </span>
                                                )
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(safeGet(response, 'data.full_content') || safeGet(response, 'data.content')) && (
                                    <div className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg">
                                        <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Content Preview:</div>
                                        <div className="text-gray-700 dark:text-gray-300 text-xs whitespace-pre-wrap max-h-32 overflow-y-auto">
                                            {(() => {
                                                const content = response.data.full_content || response.data.content;
                                                return content && content.length > 300
                                                    ? `${content.substring(0, 300)}...\n\n[Scroll to see more]`
                                                    : content;
                                            })()}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-gray-600">
                                    {response.executionTime && (
                                        <span>Generated in {response.executionTime.toFixed(1)}s</span>
                                    )}
                                    <span>Status: {response.status || 'completed'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm">
                                <div className="flex items-center text-red-600 dark:text-red-400 font-semibold mb-2">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    Error
                                </div>
                                <div className="text-gray-700 dark:text-gray-300">{response.error}</div>
                                {response.error.includes("taking longer") && (
                                    <div className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                                        The AI crew is processing your request. This can take 2-5 minutes.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex w-full items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Type your blog topic here..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="bg-gray-100 dark:bg-gray-700 rounded-lg border-none outline-none px-4 py-3 text-sm flex-1 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200 disabled:opacity-50 focus:ring-2 focus:ring-cyan-500"
                    />

                    <button
                        className="bg-gradient-to-r from-[#36c5d1] to-[#A82ED3] hover:from-[#2ea9b8] hover:to-[#9625bd] text-white px-4 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
                        aria-label="Send"
                        type="button"
                        onClick={handleSendMessage}
                        disabled={isLoading || !inputValue.trim()}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Generating...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                <span>Send</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
