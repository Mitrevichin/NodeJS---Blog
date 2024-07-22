const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

const adminLayout = '../layouts/admin';

// Login Check Middleware
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

// Admin - Login Page
router.get('/admin', async (req, res) => {
    try {
        const locals = {
            title: 'Admin',
            description: 'Simple blog with NodeJS, Express and MongoDB'
        }

        res.render('admin/index', { locals, layout: adminLayout });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server error')
    }

});

// Admin - Check Login
router.post('/admin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ userdId: user._id }, jwtSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');

    } catch (err) {
        console.log(err);
        res.status(500).send('Server error')
    }

});

// Admin - Register
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User created', user });
        } catch (err) {
            if (err.code === 11000) {
                res.status(409).json({ message: 'User already in use' });
            }
        }

    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }

});

// Admin - Dashboard
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple blog with NodeJS, Express and MongoDB'
        }
        const articles = await Post.find({}).lean();

        res.render('admin/dashboard', {
            locals,
            articles,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});

// Admin - Create New Post (GET)
router.get('/add-post', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple blog with NodeJS, Express and MongoDB'
        }
        const articles = await Post.find({}).lean();
        res.render('admin/add-post', { locals, layout: adminLayout });

    } catch (error) {
        console.log(error);
    }

});

// Admin - Create New Post (POST)
router.post('/add-post', authMiddleware, async (req, res) => {
    try {
        const { title, body } = req.body;
        const newPost = new Post({ title, body });
        await newPost.save();

        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }

});

// Admin - Get a Post (GET)
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Edit Post',
            description: 'Simple blog with NodeJS, Express and MongoDB'
        }

        const article = await Post.findById(req.params.id).lean();

        res.render('admin/edit-post', {
            locals,
            article,
            layout: adminLayout
        });

    } catch (error) {
        console.log(error);
    }

});


// Admin - Edit a Post (PUT)
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
    try {

        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }

});

// Admin - Delete Post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

// Admin - Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;