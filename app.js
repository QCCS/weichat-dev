var express = require('express');
var app = express();
//解析xml必须
var bodyParser = require('body-parser');
require('body-parser-xml')(bodyParser);

//加密对比验证
var sha1 = require('sha1');

//请求token
const request = require('request');
const qs = require('querystring');
//保存token
const fs = require('fs');
//解析xml
app.use(bodyParser.xml({
    limit: '1MB',
    xmlParseOptions: {
        normalize: true,
        normalizeTags: true,
        explicitArray: false
    }
}));
var config = {
    weichat: {
        appID: "wxf175b5f24b6348c4",
        appSecret: "bd2ec5dfe5320967d0132ed2e935faf1",
        token: "qianchaochushui"
    }
}







app.all('*', function (req, res) {
    console.log(req.body.xml);
    //设置返回数据header
    res.writeHead(200, {'Content-Type': 'application/xml'});
    //关注后回复
    if (req.body.xml.event && req.body.xml.event === 'subscribe') {
        var resMsg = autoReply('text', req.body.xml, '欢迎关注,我是机器人,你可以与我对话');
        res.end(resMsg);
    } else {
        console.log(req.body.xml.content);
        var info = (req.body.xml.content);
        var resMsg = autoReply('text', req.body.xml, info);
        res.end(resMsg);
    }
});

//验证服务器
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
    }
});


//自动回复模板
function autoReply(msgType, requestData, info) {
    switch (msgType) {
        case 'text':
            var resMsg = '<xml>' +
                '<ToUserName><![CDATA[' + requestData.fromusername + ']]></ToUserName>' +
                '<FromUserName><![CDATA[' + requestData.tousername + ']]></FromUserName>' +
                '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
                '<MsgType><![CDATA[text]]></MsgType>' +
                '<Content><![CDATA['+info+']]></Content>' +
                '</xml>';
            break;
        //关注事件
        case 'subscribe':
            var resMsg = '<xml>' +
                '<ToUserName><![CDATA[' + requestData.fromusername + ']]></ToUserName>' +
                '<FromUserName><![CDATA[' + requestData.tousername + ']]></FromUserName>' +
                '<CreateTime>' + parseInt(new Date().valueOf() / 1000) + '</CreateTime>' +
                '<MsgType><![CDATA[text]]></MsgType>' +
                '<Content><![CDATA['+info+']]></Content>' +
                '</xml>';
    }
    return resMsg;
}

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
refreshToken();

//token
//const token = fs.readFileSync('./token').toString();
//console.log("读取的token:"+token);


var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});