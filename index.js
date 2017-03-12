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
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

let frame = "";

app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging;
    //let frame="";
    console.log("DOGE");
    for (let i = 0; i < messaging_events.length; i++) {

        let event = messaging_events[i];
        let sender = event.sender.id;
        //sendText(sender, "Frame: "+frame);
        if (event.message && event.message.text) {
            let text = event.message.text;
            console.log("Frame: "+frame);
            //sendText(sender, "Frame: "+frame);
            //sendText(sender, "Text echo: " + text.substring(0, 100))
            let greeting = "Hi, do you want to see a cost comparisson between your city and Blagoevgrad, Bulgaria?";
            /*if(text=="hi")
            {
                sendText(sender,greeting);
                frame = "greeting";
                break;
            }

            if(frame=="greeting")
            {
                if(text.toLowerCase()=="yes")
                {
                    sendText(sender,"How would you prefer to check the prices?");
                    sendGenericMessage(sender)
                }
                else
                {
                    sendText(sender,"Do you have a question to the administration?");
                    frame="askAdministration";
                }

            }*/

            switch (frame){
                case "":
                    //sendText(sender,"Empty Frame:" + frame);
                    console.log("Empty");
                    if(text=="hi")
                    {
                        sendText(sender,greeting);
                        frame = "greeting";
                        res.sendStatus(226);
                    }
                    break;

                case "greeting":
                    console.log("Greeting");
                    if(text.toLowerCase()=="yes")
                    {
                        sendText(sender,"How would you prefer to check the prices?");
                        sendGenericMessage(sender);
                        res.sendStatus(226);
                    }
                    else
                    {
                        sendText(sender,"Do you have a question to the administration?");
                        frame="askAdministration";
                    }
                    break;

                case "askAdministration":
                    console.log("ask");
                    if(text.toLowerCase()=="yes")
                    {
                        sendText(sender,"I will ask the administration");
                    }
                    else
                    {
                        sendText(sender, "The bot can't answer these questions. A person from admissions office will answer as soon as possible.")
                        frame="";
                    }
                    break;
            }

            console.log("The frame is: "+frame);
            //sendText(sender,"The texts is: " + text);
            //sendText(sender,"The frame is: " + frame);
        }
    }
    //sendText(sender,"DFGHGJBKJLIOYUGHFTCGVJHThe frame is: " + frame);
    res.sendStatus(226)
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
}

function sendGenericMessage(recipientId) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "generic",
                    elements: [{
                        title: "Cost-comaprison",
                        subtitle: "Check the prices in Blagoevgrad",
                        item_url: "http://nodeci.azurewebsites.net/",
                        image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                        buttons: [{
                            type: "web_url",
                            url: "http://nodeci.azurewebsites.net/",
                            title: "Check Prices online"
                        }, {
                            type: "postback",
                            title: "Chat with bot",
                            payload: "Payload for first bubble",
                        }],
                    }]
                }
            }
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

/**
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
*/

app.listen(app.get('port'),function(res,req) {
    console.log("running: port");
});
