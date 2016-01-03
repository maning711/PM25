var express = require('express')
  , mongodb = require('mongodb')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session');

app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cookieParser());
app.use(session({
	resave: false,
    saveUninitialized: true,
	secret : 'my secret'
}));

app.set('view engine', 'jade');

app.set('view option', { layout : false });

app.get('/', function (req, res) {
	res.render('index', { authenticated : false });
});

app.get('/login', function (req, res) {
	res.render('login');
});

app.get('/signup', function (req, res) {
	res.render('signup');
});

app.listen(3000);