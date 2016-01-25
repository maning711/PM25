var req = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , express = require('express');

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

function product (product_src, product_img_src, product_price, product_title,
    product_shop_src, product_shop_name, product_volume, product_evaluate_src,
    product_evaluate) {
    this.product_src = product_src;
    this.product_img_src = product_img_src;
    this.product_price = product_price;
    this.product_title = product_title;
    this.product_shop_src = product_shop_src;
    this.product_shop_name = product_shop_name;
    this.product_volume = product_volume;
    this.product_evaluate_src = product_evaluate_src;
    this.product_evaluate = product_evaluate;
}

var productList = new Array();

req({
    url : 'https://list.tmall.com/search_product.htm?q=PM2.5',
    method : 'GET',
    encoding : null,
    headrs : {
        'accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'accept-language' : 'ja,en-US;q=0.8,en;q=0.6'
    }
}, function (error, response, body) {
    if (!error) {

        var $ = cheerio.load(response.body.toString());
        $('div.product-iWrap').each(function() {
            var me = $(this);
            var temp;
            var product_src;
            var product_img_src;
            var product_price;
            var product_title;
            var product_shop_src;
            var product_shop_name;
            var product_volume;
            var product_evaluate_src;
            var product_evaluate;

            product_src = me.find('div.productImg-wrap a').attr('href');
            temp = cheerio.load(me.find('div.productImg-wrap a').html().replace('\r\n', '').replace('\r\n', ''));
            if (temp('img').attr('data-ks-lazyload') == undefined) {
                product_img_src = temp('img').attr('src');
            } else {
                product_img_src = temp('img').attr('data-ks-lazyload');
            }
            product_price = me.find('p.productPrice em').attr('title');
            product_title = me.find('p.productTitle a').attr('title');
            product_shop_src = me.find('div.productShop a').attr('href');
            product_shop_name = me.find('div.productShop a').text();
            product_volume = me.find('p.productStatus em').text();
            product_evaluate_src = me.find('p.productStatus a').attr('href');
            product_evaluate = me.find('p.productStatus a').text();
            
            var prdt = new product(product_src, product_img_src, product_price,
                iconv.encode(product_title, 'UTF-8'), product_shop_src,
                iconv.encode(product_shop_name, 'UTF-8'), product_volume,
                product_evaluate_src, iconv.encode(product_evaluate, 'UTF-8'));
            productList.push(prdt);
            console.log(me.find('p.productTitle').html());
        });
    }
});

/**
 * default route
 */
app.get('/', function (req, res) {
    res.locals.productList = productList;
    res.render('index');
});

/**
 * listener
 */
app.listen(3000);