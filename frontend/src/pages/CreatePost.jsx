import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const { auth } = useAuth();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Clear the image URL when a file is selected since we can't use local file paths
    if (file) {
      setImageUrl('');
      setError('Note: File upload is not yet implemented. Please use an image URL instead.');
    }
  };

  const handleUploadImage = () => {
    // For now, just open the file picker
    // In the future, this could upload to a cloud service
    document.getElementById('fileInput').click();
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (!auth?.user) {
      setError('You must be logged in to create a post');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate image URL (don't allow local file paths)
      const imageUrlToSave = imageUrl.trim();
      if (imageUrlToSave && (imageUrlToSave.startsWith('C:') || imageUrlToSave.startsWith('file://'))) {
        setError('Local file paths are not allowed. Please use a web URL (e.g., https://example.com/image.jpg)');
        return;
      }

      const postData = {
        title: title.trim(),
        summary: summary.trim() || content.substring(0, 150) + '...', // Auto-generate summary if not provided
        content: content.trim(),
        image: imageUrlToSave,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        // Removed author field - backend will get it from JWT token
      };

      console.log('Creating post with data:', postData);

      // Submit the post
      const response = await axiosInstance.post('/posts', postData);
      
      if (response.data.success) {
        setSuccess('Post created successfully!');
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to create post. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 transition-colors duration-200">
            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center transition-colors duration-200">Create a post</h1>
            </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Success/Error Messages */}
            {success && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-lg transition-colors duration-200">
                    {success}
                </div>
            )}
            
            {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg transition-colors duration-200">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {/* Title and Summary Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                            placeholder="Enter post title..."
                            disabled={loading}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                            Summary
                        </label>
                        <input
                            type="text"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                            placeholder="Brief summary of your post..."
                            disabled={loading}
                            maxLength="200"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Leave empty to auto-generate from content</p>
                    </div>
                </div>

                {/* Tags and Image URL Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                            Add tags
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                            placeholder="Enter tags separated by commas..."
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors duration-200">
                            Image URL
                        </label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors duration-200"
                            placeholder="https://example.com/image.jpg"
                            disabled={loading}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-200">Use a web URL like https://picsum.photos/400/300 for a random image</p>
                    </div>
                </div>

                <div
                    className="border-2 border-dashed rounded-lg p-6 bg-blue-50 dark:bg-gray-700 transition-colors duration-200"
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
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                        >
                        Choose File
                        </button>
                        <span className="text-gray-600 dark:text-gray-300 transition-colors duration-200">
                        {selectedFile ? selectedFile.name : 'No file chosen'}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={handleUploadImage}
                        className="px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        style={{
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

                        {/* Content Section */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200">
                                    Content *
                                </label>
                                <select className="px-3 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm transition-colors duration-200">
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
                                    className="w-full h-64 px-4 py-3 border-2 border-blue-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition-colors duration-200 resize-none"
                                    placeholder="Write your ideas here..."
                                    disabled={loading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Publish Button */}
                        <div className="flex justify-center">
                            <button
                                onClick={handlePublish}
                                disabled={loading || !title.trim() || !content.trim()}
                                className="px-12 py-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white font-semibold rounded-full hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? 'Publishing...' : 'Publish'}
                            </button>
                        </div>
                    </div>
                </div>

        {/* Footer */}
        <Footer />
    </div>
);
}