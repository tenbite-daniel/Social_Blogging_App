import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import BeforeSigningUp from "./pages/beforesigningup.jsx";
import About from "./pages/About.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CreatePostPage from "./pages/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";
import Homepage from "./pages/Homepage.jsx";
import PasswordReset from "./pages/PasswordReset.jsx";

function App() {
    return (
        <Router>
            <div>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<BeforeSigningUp />} />
                        <Route path="/home" element={
                            <ProtectedRoute>
                                <Homepage />
                            </ProtectedRoute>
                        } />
                        <Route path="/about" element={<About />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/password-reset" element={<PasswordReset />} />
                        <Route path="/create-post" element={
                            <ProtectedRoute>
                                <CreatePostPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </AuthProvider>
            </div>
        </Router>
    );
}

export default App;
