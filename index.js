/**
 * created by maning
 */
var express = require('express')
  , mongodb = require('mongodb')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , superagent = require('superagent');

/**
 * create the app
 */
app = express();

/**
 * set view item
 */
app.set('view engine', 'jade');

/**
 * set the middleware
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	resave: false,
  saveUninitialized: true,
	secret : 'my secret'
}));

/**
 * authenticated check
 */
app.use(function (req, res, next) {
  if (req.session.loggedIn) {
    var objectID = mongodb.ObjectID;
    res.locals.authenticated = true;
    app.users.findOne({ _id: objectID(req.session.loggedIn) }, function (err, doc) {
      if (err) return next(err);
      res.locals.me = doc;
      next();
    });
  } else {
    res.locals.authenticated = false;
    next();
  }
});

/**
 * get the logined user's IP and city, PM25 data
 */
var loggedIP;
var loggedPm25;
var loggedCity = superagent.post('http://pv.sohu.com/cityjson?ie=utf-8')
  .set('Accept', 'application/json')
  .end(function (err, res) {
    if (err) throw err;

    // get the IP and City
    var json;
    var result = res.text;
    result = result.split('=')[1].trim();
    result = result.replace(';','');
    json = JSON.parse(result);
    loggedIP = json.cip.toString();
    loggedCity = json.cname.replace('市','');

    // get pm2.5 data of the city
    superagent.post('http://api.lib360.net/open/pm2.5.json?city=' + loggedCity)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        var json = JSON.parse(res.text);
        if (err) throw err;
        loggedPm25 = json.pm25;
      });
  });

/**
 * default route
 */
app.get('/', function (req, res) {
  res.locals.loggedCity = loggedCity;
  res.locals.loggedPm25 = loggedPm25
	res.render('index');
});

/**
 * login route
 */
 app.get('/login', function (req, res) {
  res.render('login');
});

 /**
 * logined route
 */
app.get('/login/:signupEmail', function (req, res) {
	res.render('login', { signupEmail : req.params.signupEmail });
});

/**
 * login post route
 */
app.post('/login', function (req, res) {
  app.users.findOne({ email : req.body.user.email, password : req.body.user.password },
    function (err, doc) {
      if (err) return next(err);
      if (!doc) return res.send('<p>User not found. Go back and try again.</p>');
      req.session.loggedIn = doc._id.toString();
      res.redirect('/');
    });
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
 * logout route
 */
app.get('/logout', function (req, res) {
  req.session.loggedIn = null;
  res.redirect('/');
});

/**
 * connect to db
 */
var MongoClient = mongodb.MongoClient;
var DB_CONN_STR = 'mongodb://localhost:27017/test';

MongoClient.connect(DB_CONN_STR, function(err, db) {
  if (err) throw err;
  app.users = db.collection('maning');
  console.log('\033[96m + \033[39m connected to mongodb');

  db.ensureIndex('users', 'email', function (err) {
    if (err) throw err;
    db.ensureIndex('users', 'email', function (err) {
      if (err) throw err;
      console.log('\033[96m + \033[39m ensered indexes');
    });
  });
});

/**
 * listener
 */
app.listen(3000);