const express = require('express');
const router = express.Router();
const Post = require('../models/Post');





// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single post
router.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new post
router.post('/posts', async (req, res) => {
    const { title, summary, content } = req.body;
    const post = new Post({ title, summary, content });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a post
router.put('/posts/:id', async (req, res) => {
    const { title, summary, content } = req.body;

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { title, summary, content },
            { new: true }
        );
        if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
        res.json(updatedPost);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a post
router.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
