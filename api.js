const express = require('express');
const router = express.Router();



// code ip dictionary
var dict = {};

router.post('/host', (req, res) => {
    var data = req.body;
    if(!data){
        res.json({succes: false, data: {message: "no data!"}});
    }
    var ip = data.ip;
    if(!ip){
        res.json({succes: false, data: {message: "no ip!"}});
    }

    do{
    var char1 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char2 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char3 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char4 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var code = char1 + char2 + char3 + char4;  
    }while(dict[code]);

    dict[code] = ip;

    res.json({succes: true, data: {code: code}});
});

router.post('/connect', (req, res) => {
    var data = req.body;
    if(!data){
        res.json({succes: false, data: {message: "no data!"}});
    }
    
    var code = data.code;

    if(!code){
        res.json({succes: false, data: {message: "no code bro!"}});
    }
    
    var ip = dict[code];

    if(!ip){
        res.json({succes: false, data: {message: "no ip found!"}});
    }

    res.json({succes: true, data: {ip: ip}});
});

module.exports = router;