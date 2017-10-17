const express = require('express');
const router = express.Router();

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// code ip dictionary
var dict = {};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.post('/host', (req, res) => {
    var data = req.body;
    if(!data){
        sendError("no data", res);
    }
    var ip = data.ip;
    if(!ip){
        sendError("no ip!", res);
    }

    do{
    var char1 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char2 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char3 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var char4 = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    var code = char1 + char2 + char3 + char4;  
    }while(dict[code]);

    dict[code] = ip;

    response.data = code;
    res.json(response);
});

router.post('/connect', (req, res) => {
    var data = req.body;
    if(!data){
        sendError("no data", res);
    }

    var code = data.code;

    if(!code)
        sendError( "no code bro!", res);
    
    var ip = dict[code];

    if(!ip){
        sendError( "no match", res);
    }
    response.data = ip
    res.json(response);
});

module.exports = router;