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
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/test';

MongoClient.connect(DB_CONN_STR, function(err, db) {
    if (err) throw err;
    console.log('\033[96m + \033[39m connected to mongodb');
    app.users = db.collection('maning');
});

/**
 * listener
 */
app.listen(3000);