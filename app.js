require('dotenv').config();
const express = require('express');
const hbs = require('express-handlebars');
const mainRouter = require('./server/routes/main');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('public'));

// Templating engine configuration (hbs)
app.engine('hbs', hbs.create({
    extname: '.hbs'
}).engine);
app.set('view engine', 'hbs');

app.use('/', mainRouter);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));