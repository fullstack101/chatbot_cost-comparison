/**
 * Created by Atanas on 06-Mar-17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.set('port', (process.env.PORT || 5000));

//Allow us to process data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//ROUTES

app.get('/', function(req,res) {
    res.send("Hi, I'm a chatbot");
});

//FACEBOOK

/**app.get('/webhook/', function(res,req) {
    if(req.query['hub.verify_token'] === "token987") {
        res.send(req.query['hub.challenge'])
    }
    res.send("Wrong token");
});*/

app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === "token987") {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.listen(app.get('port'),function(res,req) {
    console.log("running: port");
});
