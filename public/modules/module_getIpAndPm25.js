/**
 * created by maning
 * module : get the IP and PM2.5
 */ 
var superagent = require('superagent');
var logInfo;

function getIpAndPm25 (logInfo) {
  return superagent.post('http://pv.sohu.com/cityjson?ie=utf-8')
  .set('Accept', 'application/json')
  .end(function (err, res) {
    if (err) throw err;

    // get the IP and City
    var json;
    var result = res.text;
    result = result.split('=')[1].trim();
    result = result.replace(';','');
    json = JSON.parse(result);
    logInfo.loggedIP = json.cip.toString();
    logInfo.loggedCity = json.cname.replace('市辖区','');
    logInfo.loggedCity = logInfo.loggedCity.replace('市','');

    // get pm2.5 data of the city
    superagent.post('http://api.lib360.net/open/pm2.5.json?city=' + logInfo.loggedCity)
      .set('Accept', 'application/json')
      .end(function (err, res) {
        var json = JSON.parse(res.text);
        if (err) throw err;
        logInfo.loggedPm25 = json.pm25;
      });
  });
}

exports.getIpAndPm25 = getIpAndPm25;