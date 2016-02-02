/**
 * created by maning
 * module : get the products' info from Tmall
 */ 
var req = require('request')
  , cheerio = require('cheerio')
  , iconv = require('iconv-lite');

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

function getProduct() {
    req({
        url : 'https://list.tmall.com/search_product.htm?q=PM2.5',
        method : 'GET',
        encoding : null,
        headrs : {
            'accept' : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'accept-language' : 'ja,en-US;q=0.8,en;q=0.6',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
        }
    }, function (error, response, body) {
        if (!error) {
            var $ = cheerio.load(iconv.decode(body, 'gbk'), {decodeEntities: false});
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
                    product_title, product_shop_src, product_shop_name, product_volume,
                    product_evaluate_src, product_shop_name);
                productList.push(prdt);
            });
        }
    });
    return productList;
}

exports.getProduct = getProduct;