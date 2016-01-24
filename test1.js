var req = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
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
	headrs : {
		'accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
		'accept-language' : 'ja,en-US;q=0.8,en;q=0.6'
	}
}, function (error, response, body) {
	if (!error) {

		var $ = cheerio.load(response.body.toString());
		var file = "D:\\Program Files\\test1\\product.html";
		
		//var i = 0;

		$('div.product-iWrap').each(function() {
			var me = $(this);
			var temp;
			//var content = 'No.' + i + '\n\n';
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
			product_img_src = temp('img').attr('data-ks-lazyload');
			product_price = me.find('p.productPrice em').attr('title');
			product_title = me.find('p.productTitle a').attr('title');
			product_shop_src = me.find('div.productShop a').attr('href');
			product_shop_name = me.find('div.productShop a').text();
			product_volume = me.find('p.productStatus em').text();
			product_evaluate_src = me.find('p.productStatus a').attr('href');
			product_evaluate = me.find('p.productStatus a').text();

			//content = content + 'product info : ' + product_src + '\n\n';
			//content = content + 'product img : ' + product_img_src + '\n\n';
			//content = content + 'product price : ' + product_price + '\n\n';
			//content = content + 'product title : ' + product_title + '\n\n';
			//content = content + 'product shop info : ' + product_shop_src + '\n\n';
			//content = content + 'product shop name : ' + product_shop_name + '\n\n';
			//content = content + 'product volume : ' + product_volume + '\n\n';
			//content = content + 'product eval info : ' + product_evaluate_src + '\n\n';
			//content = content + 'product eval : ' + product_evaluate + '\n\n';
			//content = content + '============================================================\n\n';
			
			var prdt = new product(product_src, product_img_src, product_price,
				iconv.encode(product_title, 'utf-8'), product_shop_src,
				iconv.encode(product_shop_name, 'utf-8'), product_volume,
				product_evaluate_src, iconv.encode(product_evaluate, 'utf-8'));
			productList.push(prdt);
			console.log(prdt);
			
			// 把中文转换成字节数组
	    	//var arr = iconv.encode(me.html(), 'gbk');
	    	// appendFile，如果文件不存在，会自动创建新文件
		    // 如果用writeFile，那么会删除旧文件，直接写新文件
		    //fs.appendFile(file, arr, function(err){
		    //});
		});
	}
});

/**
 * default route
 */
app.get('/', function (req, res) {
    res.locals.priductList = productList;
	res.render('index');
});