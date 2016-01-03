var express = require('express')
  , mongodb = require('mongodb')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session');

/**
 * create the app
 */
app = express();

/**
 * set the middleware
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({
	resave: false,
    saveUninitialized: true,
	secret : 'my secret'
}));

/**
 * set view item
 */
app.set('view engine', 'jade');

/**
 * default route
 */
app.get('/', function (req, res) {
	res.render('index', { authenticated : false });
});

/**
 * login route
 */
app.get('/login', function (req, res) {
	res.render('login');
});

/**
 * signup route
 */
app.get('/signup', function (req, res) {
	res.render('signup');
});

/**
 * connect to db
 */
var server = new mongodb.Server('123.0.0.1', 27017);


/**
 * listener
 */
app.listen(3000);