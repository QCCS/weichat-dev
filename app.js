var express = require('express');
var app = express();


var config = {
    weichat: {
        appID: "wxf175b5f24b6348c4",
        appSecret: "bd2ec5dfe5320967d0132ed2e935faf1",
        token: "qianchaochushui"
    }
}

app.get('/', function (req, res) {
    res.send('Hello World!');
    console.log(req);

    //这三个加密生成签名
    // var token = config.weichat.token;
    // var nonce = this.query.nonce;
    // var timestamp = this.query.timestamp;
    // //微信生成的签名
    // var signature = this.query.signature;
    //
    // var echostr = this.query.echostr;
    //
    // var str = [token, timestamp, nonce].sort().json()
    // var sha = sha1(str);
    // if (sha === signature) {
    //     this.body = echostr + "";
    // } else {
    //     this.body = 'wrong';
    // }

});

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});