import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import BeforeSigningUp from "./pages/beforesigningup.jsx";
import About from "./pages/About.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CreatePostPage from "./pages/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";
import Homepage from "./pages/Homepage.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";
import SingleBlogPost from "./pages/SingleBlogPost.jsx";
import MyPost from "./pages/MyPost.jsx";

import AuthenticatedLayout from "./layouts/AuthenticatedLayout.jsx";

function App() {
    return (
        <ThemeProvider>
            <Router>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
                    <AuthProvider>
                    <Routes>
                      
                        <Route path="/" element={<BeforeSigningUp />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/password-reset"
                            element={<PasswordReset />}
                        />

                       
                        <Route element={<ProtectedRoute />}>
                            <Route element={<AuthenticatedLayout />}>
                                <Route path="/home" element={<Homepage />} />
                                <Route
                                    path="/create-post"
                                    element={<CreatePostPage />}
                                />
                                <Route path="/my-posts" element={<MyPost />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/post/:id" element={<SingleBlogPost />} />
                            </Route>
                        </Route>

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AuthProvider>
            </div>
        </Router>
        </ThemeProvider>
    );
}

export default App;