require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const hbs = require('express-handlebars');
const mongoStore = require('connect-mongo');
const mainRouter = require('./server/routes/main');
const adminRouter = require('./server/routes/admin');
const connectDB = require('./server/config/db');
const MongoStore = require('connect-mongo');
const { isActiveRoute } = require('./server/helpers/routeHelper');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();

app.locals.isActiveRoute = isActiveRoute;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keybord cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: {maxAge: new Date( Date.now() + (36000000) )}
}));

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
app.use('/', adminRouter);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));