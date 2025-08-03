import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";

import BeforeSigningUp from "./pages/beforesigningup.jsx";
import About from "./pages/About.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import CreatePostPage from "./pages/CreatePost.jsx";

function App() {
    return (
        <Router>
            <div>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<BeforeSigningUp />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                    <CreatePostPage />
                </AuthProvider>
            </div>
        </Router>
    );
}

export default App;
