const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

const adminLayout = '../layouts/admin';

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

module.exports = router;