var req = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var iconv = require('iconv-lite');  

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
		//console.log($('div').html());
		var file = "D:\\node\\test\\product.html";

		var products = [];
		var i = 0;
		$('.product-iWrap').each(function() {
			var content = '第' + i + '个商品信息\n\n';
			i++;
			content = $(this).html().toString() + content + '============================================================';
			// 把中文转换成字节数组
	    	var arr = iconv.encode(content, 'gbk');
	    	// appendFile，如果文件不存在，会自动创建新文件
		    // 如果用writeFile，那么会删除旧文件，直接写新文件
		    fs.appendFile(file, arr, function(err){

		    });
		});
		console.log('the count' + i);
	}
});