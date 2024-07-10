require('dotenv').config();
const express = require('express');
const hbs = require('express-handlebars');
const mainRouter = require('./server/routes/main');
const connectDB = require('./server/config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

app.use(express.static('public'));

// Templating engine configuration (hbs)
app.engine('hbs', hbs.create({
    extname: '.hbs',
    // HELPERS: The most common and cleanest way when setting dynamic values. 
    // OTHER oppurtinies are: 1.Using Inline JavaScript (Client-Side Rendering) 2.Setting Data in the Route Handler as a context when rendering a page 3.Using middleware (res.locals.year = new Date()...)
    helpers: {
        getCurrentYear: () => new Date().getFullYear()
    }
}).engine);
app.set('view engine', 'hbs');

app.use('/', mainRouter);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));