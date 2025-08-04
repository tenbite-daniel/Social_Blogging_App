import { Link } from "react-router-dom";

export default function SideNav({ isCollapsed }) {
    return (
        <aside
            className={`fixed h-[calc(100vh-4rem)] z-20 transition-all duration-300 ${
                isCollapsed
                    ? "w-0 opacity-0 -translate-x-full lg:w-16 lg:opacity-100 lg:translate-x-0"
                    : "w-64 opacity-100"
            }`}
        >
            <nav
                className={`h-full shadow-md pt-16 bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200 ${
                    isCollapsed ? "lg:p-2" : "p-4"
                }`}
            >
                {isCollapsed ? (
                    <div className="hidden lg:flex flex-col items-center space-y-6 pt-16">
                        <Link
                            to="/my-posts"
                            className="text-2xl hover:text-cyan-400"
                            title="My Posts"
                        >
                            📝
                        </Link>
                        <Link
                            to="/home"
                            className="text-2xl hover:text-cyan-400"
                        >
                            🏠
                        </Link>
                        <Link
                            to="/create-post"
                            className="text-2xl hover:text-cyan-400"
                        >
                            ✏️
                        </Link>
                        <Link
                            to="/profile"
                            className="text-2xl hover:text-cyan-400"
                        >
                            👤
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {/* Full links */}
                        <Link
                            to="/my-posts"
                            className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors dark:text-white hover:dark:text-black"
                        >
                            My Posts
                        </Link>
                        <Link
                            to="/home"
                            className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors dark:text-white hover:dark:text-black"
                        >
                            All Post
                        </Link>
                        <Link
                            to="/create-post"
                            className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors dark:text-white hover:dark:text-black"
                        >
                            Create Post
                        </Link>
                        <Link
                            to="/profile"
                            className="block px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors dark:text-white hover:dark:text-black"
                        >
                            Profile
                        </Link>
                    </div>
                )}
            </nav>
        </aside>
    );
}
