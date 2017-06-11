var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var sha1 = require('sha1');
var config = {
    weichat: {
        appID: "wxf175b5f24b6348c4",
        appSecret: "bd2ec5dfe5320967d0132ed2e935faf1",
        token: "qianchaochushui"
    }
}

app.get('/', function (req, res) {
    console.log(req.query);

    //这三个加密生成签名
     var token = config.weichat.token;
     var nonce = req.query.nonce;
     var timestamp = req.query.timestamp;
     //微信生成的签名
     var signature = req.query.signature;

     var echostr = req.query.echostr;

     var str = [token, timestamp, nonce].sort().join();
     var sha = sha1(str);

    console.log(req.method);
    console.log("sha"+sha);
    console.log("signature"+signature);
    if (req.method == 'GET') {
        if (sha == signature) {
            res.send(echostr+'')
        }else{
            res.send('err');
        }
    }
    else if(req.method == 'POST'){
        if (sha != signature) {
            return;
        }
        next();
    }

});

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});