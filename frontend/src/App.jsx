import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import BeforeSigningUp from './pages/beforesigningup.jsx';
import About from './pages/About.jsx';
import CreatePostPage from './pages/CreatePost.jsx';

function App() {
    return (
        <Router>
            <div>
                
                <Routes>
                    <Route path="/" element={<BeforeSigningUp />} />
                    <Route path="/about" element={<About />} />
                </Routes>
                <CreatePostPage />
                
                
            </div> 
        </Router>
    );
}

export default App;