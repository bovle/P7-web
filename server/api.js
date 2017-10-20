const express = require('express');
const router = express.Router();

// code ip dictionary
var dict = {};

router.post('/host', (req, res) => {
    var data = req.body;
    if(!data){
        res.json({success: false, data: {message: "no data!"}});
        return;
    }
    var ip = data.ip;
    if(!ip){
        res.json({success: false, data: {message: "no ip!"}});
        return;
    }

    var port = data.port;
    if(!port){
        res.json({success: false, data: {message: "no port!"}});
        return;
    }

    do{
    var char1 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char2 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char3 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char4 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var code = char1 + char2 + char3 + char4;  
    }while(dict[code]);

    dict[code] = ip + ":" + port;

    res.json({success: true, data: {code: code}});
});

router.post('/connect', (req, res) => {
    var data = req.body;
    if(!data){
        res.json({success: false, data: {message: "no data!"}});
        return;
    }
    
    var code = data.code;

    if(!code){
        res.json({success: false, data: {message: "no code!"}});
        return;
    }
    
    var ip = dict[code];

    if(!ip){
        res.json({success: false, data: {message: "no ip found!"}});
        return;
    }

    res.json({success: true, data: {ip: ip}});
});

module.exports = router;