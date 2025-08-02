import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import BeforeSigningUp from "./pages/beforesigningup.jsx";
import About from "./pages/About.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

function App() {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<BeforeSigningUp />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
