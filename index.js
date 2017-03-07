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

let token = "EAAa4Wnh0ewUBAFupVsHWsX9tdkUVMBHVZAtJQEF1cLF4qZCguDShji7WvEh7XQZCO0L7itkGjOxpsiWFaD23k8NRDwHEHFjKYvHqJDi0zZAKjV98H3F6lz0MvbuovJn6d92FlfepoYksrRiwikQLRZCKZBiitOqHjtn7FUcZBF2xwZDZD";

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
        console.error("Failed validation. Make sure the validation tokens match.111");
        res.sendStatus(403);
    }
});

/**app.post('/webhook', function(res,req){
   let messaging_events= req.body.entry[0].messaging;
   for (let i=0; i<messaging_events.length; i++){
       let event=messaging_events[i];
       let sender = event.sender.id;
       if (event.message && event.message.text){
           let text = event.message.text;
           sendText(sender, "Text echo: " + text.substring(0,100));
       }
   }
   res.sendStatus(200);
});

function sendText(sender, text) {
    let messageData = {text: text};
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }), function(error, response, body){
        if (error){
            console.log("sending error");
        }
        else if(response.body.error){
            console.log("response body error");
        }
    }
}*/


app.post('/webhook', function (req, res) {
    let data = req.body;

    // Make sure this is a page subscription
    if (data.object === 'page') {

        // Iterate over each entry - there may be multiple if batched
        data.entry.forEach(function(entry) {
            let pageID = entry.id;
            let timeOfEvent = entry.time;

            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.message) {
                    receivedMessage(event);
                } else {
                    console.log("Webhook received unknown event: ", event);
                }
            });
        });

        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know
        // you've successfully received the callback. Otherwise, the request
        // will time out and we will keep trying to resend.
        res.sendStatus(200);
    }
});

function receivedMessage(event) {
    let senderID = event.sender.id;
    let recipientID = event.recipient.id;
    let timeOfMessage = event.timestamp;
    let message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    let messageId = message.mid;

    let messageText = message.text;
    let messageAttachments = message.attachments;

    if (messageText) {

        // If we receive a text message, check to see if it matches a keyword
        // and send back the example. Otherwise, just echo the text we received.
        switch (messageText) {
            case 'generic':
                sendGenericMessage(senderID);
                break;

            default:
                sendTextMessage(senderID, messageText);
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function sendTextMessage(recipientId, messageText) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText
        }
    };

    callSendAPI(messageData);
}

function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: token },
        method: 'POST',
        json: messageData

    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let recipientId = body.recipient_id;
            let messageId = body.message_id;

            console.log("Successfully sent generic message with id %s to recipient %s",
                messageId, recipientId);
        } else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}


app.listen(app.get('port'),function(res,req) {
    console.log("running: port");
});
