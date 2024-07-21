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

router.get('/post/:id', async (req, res) => {
    try {
        const article = await Post.findById(req.params.id).lean();

        if (!article) {
            return res.status(404).send('Article not found');
        }

        const locals = {
            title: article.title,
            description: 'Simple blog with NodeJS, Express and MongoDB'
        }

        res.render('post', { locals, article });

    } catch (err) {
        console.log(err);
        res.status(500).send('Server error')
    }
});

router.post('/search', async (req, res) => {
    try {
        locals = {
            title: "Search",
            description: 'Simple blog with NodeJS, Express and MongoDB'
        }

        // The data is structured as key-value pairs in the req. body, where the key is the value of the name attribute, and the value is the data entered by the user.
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, '');

        const articles = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
            ]
        }).lean();

        res.render('search', { locals, articles });

    } catch (error) {
        console.log(error);
    }
});

// router.get('/about', (req, res) => {
//     res.render('about');
// });


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