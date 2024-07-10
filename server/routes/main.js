const express = require('express');
const router = express.Router();

//Routes (It will be without explicit controller cause the app is not gonna be big)
router.get('/', (req, res) => {
    const locals = {
        title: 'NodeJS Blog',
        description: 'Simple blog with NodeJS, Express and MongoDB'
    }

    res.render('index', { locals });
});

router.get('/about', (req, res) => {
    res.render('about');
});


module.exports = router;