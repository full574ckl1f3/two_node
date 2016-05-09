const 
    REDIS_HOST_STR = REDIS_HOST_STR || "192.168.99.100",
    REDIS_PORT_INT = REDIS_PORT_INT || 32830,
    WEB_SERVER_PORT_INT = WEB_SERVER_PORT_INT || 8081;

const 
    EXPRESS = require("express"),
    REDIS = require("redis");

var app = EXPRESS(),
    redis = REDIS.createClient(REDIS_PORT_INT, REDIS_HOST_STR),
    mw_arr = [];
    
app.listen(WEB_SERVER_PORT_INT);

function addUser(req, res, next){
    redis.SADD("users", req.headers["user-agent"], function(err, success){
        //err handle
        next();
    });
}
function getUser(req, res, next){
    redis.SMEMBERS("users", function(err, users){
        //err handle
        req.users_arr = users;
        next();
    });
}
function doStuff(req, res){
    var return_me = {
        msg_str: "all ok",
        all_unique_users_arr: req.users_arr
    };
    res.status(200).json(return_me);
}

mw_arr = [addUser, getUser];

app.get("/", mw_arr, doStuff);