var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var sha1 = require('sha1');


const request = require('request');
const qs = require('querystring');
const fs = require('fs');

var getRawBody = require('raw-body');

var config = {
    weichat: {
        appID: "wxf175b5f24b6348c4",
        appSecret: "bd2ec5dfe5320967d0132ed2e935faf1",
        token: "qianchaochushui"
    }
}
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    console.log(1);
    console.log(req);
    console.log(22222);
    console.log(22222);
    console.log(22222);
    console.log(22222);
    console.log(22222);
    console.log(22222);
    var data = getRawBody(req, {
        length: this.length,
        limit: '1mb',
        encoding: this.charset
    });
    console.log(222223);
    console.log(222223);
    console.log(222223);
    console.log(222223);
    console.log(222223);
    console.log(222223);
    console.log(data.toString());


    next();
});

app.get('/', function (req, res) {
    console.log(req.query);
    //这三个加密生成签名
     var token = config.weichat.token;
     var nonce = req.query.nonce;
     var timestamp = req.query.timestamp;
     //微信生成的签名
     var signature = req.query.signature;

     var echostr = req.query.echostr;

     var str = [token, timestamp, nonce].sort().join('');
     var sha = sha1(str);

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
        console.log(2);
        console.log(req);
        next();
    }

});




const getAccessToken = function () {
    let queryParams = {
        'grant_type': 'client_credential',
        'appid': config.weichat.appID,
        'secret': config.weichat.appSecret
    };

    let wxGetAccessTokenBaseUrl = 'https://api.weixin.qq.com/cgi-bin/token?'+qs.stringify(queryParams);
    let options = {
        method: 'GET',
        url: wxGetAccessTokenBaseUrl
    };
    return new Promise((resolve, reject) => {
        request(options, function (err, res, body) {
            if (res) {
                resolve(JSON.parse(body));
            } else {
                reject(err);
            }
        });
    })
};

//保存token
const saveToken = function () {
    getAccessToken().then(res => {
        let token = res['access_token'];
        console.log(token)
        fs.writeFile('./token', token, function (err) {
            if(err){
                console.log("保存token出错:"+err)
            }else {
                console.log("保存成功");
            }
        });
    })
};
//更新token
const refreshToken = function () {
    saveToken();
    setInterval(function () {
        saveToken();
    }, 7000*1000);
};

//获取token
//refreshToken();

//token
const token = fs.readFileSync('./token').toString();
console.log("读取的token:"+token);


var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});