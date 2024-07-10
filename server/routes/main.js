const express = require('express');
const Post = require('../models/Post');
const router = express.Router();

//Routes (It will be without explicit controller cause the app is not gonna be big)
router.get('/', async (req, res) => {
    try {
        const locals = {
            title: 'NodeJS Blog',
            description: 'Simple blog with NodeJS, Express and MongoDB'
        }

        // Paggination
        let perPage = 2;
        let page = req.query.page || 1;

        const articles = await Post
            .aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        // Formating dates
        articles.forEach(article => {
            article.formattedCreatedAt = Post.schema.methods.formatDate(article.createdAt);
        });

        res.render('index', {
            locals,
            articles,
            current: page,
            nextPage: hasNextPage ? nextPage : null
        });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server error')
    }

});


router.get('/about', (req, res) => {
    res.render('about');
});


module.exports = router;

/*
function insertPostData() {
    Post.insertMany([
        {
            title: 'Building a blog',
            body: 'This is a body text'
        },
        {
            title: 'NodeJS',
            body: 'This is a NodeJS text'
        },
        {
            title: 'Express',
            body: 'This is a express text'
        }
    ])
}
insertPostData();*/