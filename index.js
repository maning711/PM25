/**
 * create:maning
 */
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
app.use(bodyParser.urlencoded({ extended: true }));
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
app.get('/login/:signupEmail', function (req, res) {
	res.render('login', { signupEmail : req.params.signupEmail });
});

/**
 * signup route
 */
app.get('/signup', function (req, res) {
  res.render('signup');
});

/**
 * signup post route
 */
app.post('/signup', function (req, res, next) {
  app.users.insertOne(req.body.user, function (err, doc) {
    if (err) return next(err);
    res.redirect('/login/' + doc.ops[0].email);
  })
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