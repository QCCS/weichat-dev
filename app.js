/**
 * Created by zhouli on 2017/6/11.
 */
'use strict'

var Koa = require('koa');
var sha1 = require('sha1');

var config = {
    weichat: {
        appID: "11",
        appSecret: "aa",
        token: "aa"
    }
}


var app = new Koa();

app.use(function *(next) {
    console.log(this.query)
});

app.listen(1234);
console.log("Listening: 1234");
