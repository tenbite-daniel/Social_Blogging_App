import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUploadImage = () => {
    document.getElementById('fileInput').click();
  };

  const handlePublish = () => {
    // Handle publish logic here
    console.log({
      title,
      tags: tags.split(',').map(tag => tag.trim()),
      content,
      image: selectedFile
    });
  };

return (
    <div
        className="min-h-screen"
        style={{
            background: 'linear-gradient(to bottom, #FDF7F7, #C6F7F7)'
        }}
    >
        {/* Header */}
        <Header />

        
        <div className="bg-white">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Create a post</h1>
            </div>
        </div>

    
            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="space-y-6">
                
                <div className="grid grid-cols-2 gap-6">

                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Enter post title..."
                    />
                    </div>

                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add tags
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                        placeholder="Enter tags separated by commas..."
                    />
                    </div>
                </div>

                <div
                    className="border-2 border-dashed rounded-lg p-6 bg-blue-50"
                    style={{
                    borderImage: 'linear-gradient(90deg, #36c5d1 0%, #A82ED3 100%) 1',
                    borderColor: 'transparent'
                    }}
                >
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <input
                        type="file"
                        id="fileInput"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                        />
                        <button
                        type="button"
                        onClick={() => document.getElementById('fileInput').click()}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                        Choose File
                        </button>
                        <span className="text-gray-600">
                        {selectedFile ? selectedFile.name : 'No file chosen'}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleUploadImage}
                        className="px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        style={{
                        background: 'white',
                        border: '2px solid',
                        borderImage: 'linear-gradient(90deg, #36c5d1 0%, #A82ED3 100%) 1',
                        color: 'black'
                        }}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span style={{ color: 'black' }}>Upload Image</span>
                    </button>
                    </div>
                </div>

            
                        <div>
                            <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <select className="px-3 py-1 border border-white rounded text-sm">
                                <option>Normal</option>
                                <option>Heading 1</option>
                                <option>Heading 2</option>
                                <option>Heading 3</option>
                            </select>
                            </div>
                            <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-64 px-4 py-3 rounded-lg focus:outline-none transition-colors resize-none"
                                placeholder="Write your ideas here..."
                            />
                            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                                741 × 62
                            </div>
                            </div>
                        </div>

                        {/* Publish Button */}
                <div className="flex justify-center">
                    <button
                        onClick={handlePublish}
                        className="px-12 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Publish
                    </button>
                </div>
            </div>
        </div>

        {/* Footer */}
        <Footer />
    </div>
);
}