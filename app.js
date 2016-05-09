const   
    PORT_INT = process.env.PORT || process.env.npm_package_config_PORT_INT, // EB will set PORT for you
    REDIS_HOST_STR = process.env.REDIS_HOST_STR || process.env.npm_package_config_REDIS_HOST_STR,
    REDIS_PORT_INT = process.env.REDIS_PORT_INT || process.env.npm_package_config_REDIS_PORT_INT;

const 
    EXPRESS = require("express"),
    REDIS = require("redis");
    
var app = EXPRESS(),
    redis = REDIS.createClient(REDIS_PORT_INT, REDIS_HOST_STR);

app.listen(PORT_INT);

function addRedisThings(req, res, next){
    var key_str = "site:unique_hits",  
        msg_str = "that did not work";
    redis.SADD(key_str, req.headers["user-agent"], function(err, count_int){
        if(err){
            msg_str = err; //obj??
            res.json(200, {
                msg_str: msg_str
            });
        }else{
            req.redis_count_int = count_int;
            next();
        }
    });
}
function countRedisThings(req, res, next){
    var key_str = "site:unique_hits",  
        msg_str = "that did not work";
    redis.SCARD(key_str, function(err, count_int){
        if(err){
            msg_str = err; //obj??
            res.json(200, {
                msg_str: msg_str
            });
        }else{
            req.redis_count_int = count_int;
            next();
        }
    });
}

app.get("/", addRedisThings, countRedisThings, function(req, res, next){
    var return_me = {
        msg_str: "all worked here are the env vars",
        env_arr: [REDIS_HOST_STR, PORT_INT, req.redis_count_int]
    };
    res.json(200, return_me);
    //depreciated on new version of NODE
    // res.status(200).json(return_me);
});