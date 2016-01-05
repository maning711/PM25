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
  app.users.insert(req.body.user, {safe:true});
});

/**
 * connect to db
 */
var server = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect:true});
new mongodb.Db('test', server, {safe : true}).open(function (err, client) {
  if (err) throw err;
  console.log('connected success!');
  app.users = new mongodb.Collection(client, 'maning', {safe : true});
  /*app.users.find(function(error,cursor){
    cursor.each(function(error,doc){
      if(doc){
        console.log("First:"+doc.First+" Last:"+doc.Last + " Email:"+doc.Email + " Password:"+doc.password + " PM2.0:"+doc.PM25);
      }
    });
  });*/
});

/**
 * listener
 */
app.listen(3000);