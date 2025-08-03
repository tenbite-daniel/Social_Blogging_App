import express from 'express';
import mongoose from 'mongoose';
import Post from '../model/Post.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// GET /api/posts - Get all posts with pagination and author details
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        console.log(`Fetching posts: page=${page}, limit=${limit}, skip=${skip}`);

        // Use populate instead of aggregation for more reliable author details
        const posts = await Post.find()
            .populate('author', 'username name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        // Transform the data to match expected format
        const transformedPosts = posts.map(post => ({
            _id: post._id,
            title: post.title,
            summary: post.summary,
            image: post.image,
            content: post.content,
            tags: post.tags,
            likes: post.likes || 0,
            views: post.views || 0,
            commentCount: post.comments?.length || 0,
            createdAt: post.createdAt,
            updatedAt: post.updatedAt,
            author: {
                id: post.author?._id || post.author,
                username: post.author?.username || 'Unknown',
                name: post.author?.name || 'Unknown User',
                avatar: post.author?.avatar || '',
                email: post.author?.email || ''
            }
        }));

        // Get total count for pagination
        const totalPosts = await Post.countDocuments();
        const totalPages = Math.ceil(totalPosts / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            success: true,
            data: transformedPosts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                postsPerPage: limit,
                hasNextPage,
                hasPrevPage,
                nextPage: hasNextPage ? page + 1 : null,
                prevPage: hasPrevPage ? page - 1 : null
            }
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch posts',
            details: error.message
        });
    }
});

// GET /api/posts/:id - Get single post by ID with author details
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Increment view count
        await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } });

        // Get post with author and comments details
        const post = await Post.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(postId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: 'comments',
                    foreignField: '_id',
                    as: 'commentDetails'
                }
            },
            {
                $unwind: '$authorDetails'
            },
            {
                $project: {
                    title: 1,
                    summary: 1,
                    image: 1,
                    content: 1,
                    tags: 1,
                    likes: 1,
                    views: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    'author.id': '$authorDetails._id',
                    'author.username': '$authorDetails.username',
                    'author.name': '$authorDetails.name',
                    'author.avatar': '$authorDetails.avatar',
                    'author.email': '$authorDetails.email',
                    comments: '$commentDetails'
                }
            }
        ]);

        if (!post || post.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        res.json({
            success: true,
            data: post[0]
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch post',
            details: error.message
        });
    }
});

// POST /api/posts - Create new post (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, summary, content, image, tags } = req.body;
        const authorId = req.user.id;

        console.log('Creating post with data:', { title, summary, content, image, tags, authorId });

        // Validation
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                error: 'Title and content are required'
            });
        }

        // Create new post
        const newPost = new Post({
            title: title.trim(),
            summary: summary?.trim() || content.substring(0, 150) + '...',
            content: content.trim(),
            image: image?.trim() || '',
            tags: Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [],
            author: authorId
        });

        const savedPost = await newPost.save();

        // Populate author details for response
        await savedPost.populate('author', 'username name email avatar');

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: savedPost
        });
    } catch (error) {
        console.error('Error creating post:', error);
        
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: validationErrors
            });
        }

        res.status(500).json({
            success: false,
            error: 'Failed to create post',
            details: error.message
        });
    }
});

// PUT /api/posts/:id - Update post (protected, author only)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;
        const { title, summary, content, image, tags } = req.body;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        // Check if user is the author
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You can only edit your own posts'
            });
        }

        // Update the post
        const updateData = {};
        if (title) updateData.title = title.trim();
        if (summary) updateData.summary = summary.trim();
        if (content) updateData.content = content.trim();
        if (image !== undefined) updateData.image = image.trim();
        if (tags) updateData.tags = Array.isArray(tags) ? tags.filter(tag => tag.trim()) : [];

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'username name email avatar');

        res.json({
            success: true,
            message: 'Post updated successfully',
            data: updatedPost
        });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update post',
            details: error.message
        });
    }
});

// DELETE /api/posts/:id - Delete post (protected, author only)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user.id;

        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                error: 'Post not found'
            });
        }

        // Check if user is the author
        if (post.author.toString() !== userId) {
            return res.status(403).json({
                success: false,
                error: 'You can only delete your own posts'
            });
        }

        await Post.findByIdAndDelete(postId);

        res.json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete post',
            details: error.message
        });
    }
});

export default router;
