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
let prevFrame="";
let botID=638196106390731;

app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging;
    //let frame="";
    //console.log("DOGE");
    //console.log("Length: "+messaging_events.length);
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;
        let payload="";
       /* console.log("Event: "+event);
        console.log("Event: "+JSON.stringify(event));
        console.log("Event: "+JSON.stringify(event.postback));
        if(event.postback)
        {
            console.log("Event: "+event.postback.payload);
        }

        console.log("Sender: "+sender);
        //sendText(sender, "Frame: "+frame);
        console.log("message: "+ event.message);
        console.log("text: "+event.message.text);*/
        if (event.message && event.message.text && sender!=botID) {
            let text = event.message.text;
            decision(sender,text);
        }
        if (event.postback){
            let payload = event.postback.payload;
            decision(sender,payload);
            //sendText(sender,"The payload is: "+payload);
            console.log("payload: "+payload);
        }


    }
    res.sendStatus(200)
});

function decision(sender,text){
    let greeting = "Hi, do you want to see a cost comparison between your city and Blagoevgrad, Bulgaria?";
    if(text=="back")
    {
        frame=prevFrame;
    }
    if(text=="quit")
    {
        frame="";
    }

    sendText(sender, "The text is: "+text);
    switch (frame){
        case "":
            //sendText(sender,"Empty Frame:" + frame);
            console.log("Empty");
            if(text=="hi")
            {
                sendText(sender,greeting);
                frame = "greeting";
            }
            break;

        case "greeting":
            console.log("Greeting");
            if(text.toLowerCase()=="yes")
            {
                sendText(sender,"How would you prefer to check the prices?");
                sendGenericMessage(sender);
                prevFrame=frame;
                frame="answer";
            }
            else
            {
                sendText(sender,"Do you have a question to the administration?");
                prevFrame=frame;
                frame="askAdministration";
            }
            break;

        case "askAdministration":
            console.log("ask");
            if(text.toLowerCase()=="yes")
            {
                sendText(sender,"I will ask the administration");
                sendText(sender, "Thank you messaging us. Goodbye");
                prevFrame=frame;
                frame="";
            }
            else
            {
                sendText(sender, "The bot can't answer these questions. A person from admissions office will answer as soon as possible.");
                prevFrame=frame;
                frame="";
            }
            break;
        case "city":
            sendText(sender, "What comparison category do you want to see?");
            sendGenericMessagePriceType(sender);
            prevFrame=frame;
            frame="choice1";
            break;
        case "answer":
            if(text=="chat")
            {
                sendText(sender, "Where are you from?");
                prevFrame=frame;
                frame="city";
            }
            else
            {
                sendText(sender, "Opening website. Thank you messaging us. Goodbye.");
                prevFrame=frame;
                frame="";
            }
            break;
        case "choice1":
            if(text=="restaurants")
            {
                sendGenericMessageRestaurants(sender);
                prevFrame=frame;
                frame="choice2";
            }
            else if(text == "markets")
            {
                sendGenericMessageMarkets(sender);
                prevFrame=frame;
                frame="choice2";
            }
            else if(text == "transportation")
            {
                sendGenericMessageTransportation(sender);
                prevFrame=frame;
                frame="choice2";
            }
            else if(text == "utilities")
            {
                sendGenericMessageUtilities(sender);
                prevFrame=frame;
                frame="choice2";
            }
            else if(text == "sports")
            {
                sendGenericMessageSports(sender);
                prevFrame=frame;
                frame="choice2";
            }
            else if(text == "clothing")
            {
                sendGenericMessageClothing(sender);
                prevFrame=frame;
                frame="choice2";
            }
            else if(text=="quit")
            {
                sendText(sender,"Thank you messaging us. Goodbye.");
                prevFrame=frame;
                frame="";
            }
            else
            {
                sendText(sender, "Cannot recognise answer. Select one of the options or write quit to end the conversation.");
                sendGenericMessagePriceType(sender);
            }
            break;
        case "choice2":
            if(text=="meal")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="McMeal")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="McMeal")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="beer")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="cappuccino")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="coke")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="water")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="milk")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="cheese")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="apples")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="potato")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="wine")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="cigarettes")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="ticket")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="taxi")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="gasoline")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="mobile")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="internet")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="fitness")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="cinema")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="jeans")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            else if(text=="shoes")
            {
                //send request
                sendText(sender,"Do you want to see something else?");
                frame="checkAgain";
            }
            break;
        case "checkAgain":
            if(text=="yes")
            {
                frame="city";
            }
            else if(text=="no")
            {
                frame="greeting";
            }
            else
            {
                sendText(sender, "Cannot recognize answer. Please write yes or no.")
            }
            break;
    }
}

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

function sendGenericMessagePriceType(recipientId){
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
                        title: "Categories",
                        subtitle: "Choose a category",
                        item_url: "http://nodeci.azurewebsites.net/",
                        image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                        buttons: [{
                            type: "postback",
                            title: "Restaurants",
                            payload: "restaurants"
                        }, {
                            type: "postback",
                            title: "Markets",
                            payload: "markets",
                        }, {
                            type: "postback",
                            title: "Transportation",
                            payload: "transportation",
                        }]
                    },
                        {
                            title: "Categories",
                            subtitle: "Choose a category",
                            item_url: "http://nodeci.azurewebsites.net/",
                            image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                            buttons: [{
                            type: "postback",
                            title: "Utilities(Monthly)",
                            payload: "utilities",
                        }, {
                            type: "postback",
                            title: "Sports and Leisure",
                            payload: "sports",
                        }, {
                            type: "postback",
                            title: "Clothing and Shoes",
                            payload: "clothing",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
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
                        title: "Cost-comparison",
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
                            payload: "chat"
                        }],
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessageRestaurants(recipientId){
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
                        title: "Categories",
                        subtitle: "Choose a category",
                        item_url: "http://nodeci.azurewebsites.net/",
                        image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                        buttons: [{
                            type: "postback",
                            title: "Meal Restaurant",
                            payload: "meal"
                        }, {
                            type: "postback",
                            title: "McMeal at McDonalds",
                            payload: "McMeal",
                        }, {
                            type: "postback",
                            title: "Domestic Beer",
                            payload: "beer",
                        }]
                    },
                        {
                            title: "Categories",
                            subtitle: "Choose a category",
                            item_url: "http://nodeci.azurewebsites.net/",
                            image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                            buttons: [{
                                type: "postback",
                                title: "Cappuccino",
                                payload: "cappuccino",
                            }, {
                                type: "postback",
                                title: "Coke/Pepsi",
                                payload: "coke",
                            }, {
                                type: "postback",
                                title: "Water",
                                payload: "water",
                            }]
                        }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessageMarkets(recipientId){
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
                        title: "Categories",
                        subtitle: "Choose a category",
                        item_url: "http://nodeci.azurewebsites.net/",
                        image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                        buttons: [{
                            type: "postback",
                            title: "Milk(1 liter)",
                            payload: "milk"
                        }, {
                            type: "postback",
                            title: "Local Cheese (1kg)",
                            payload: "cheese",
                        }, {
                            type: "postback",
                            title: "Apples (1kg)",
                            payload: "apples",
                        }]
                    },
                        {
                            title: "Categories",
                            subtitle: "Choose a category",
                            item_url: "http://nodeci.azurewebsites.net/",
                            image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                            buttons: [{
                                type: "postback",
                                title: "Potato (1kg)",
                                payload: "potato",
                            }, {
                                type: "postback",
                                title: "Bottle of Wine",
                                payload: "wine",
                            }, {
                                type: "postback",
                                title: "Pack of Cigarettes",
                                payload: "cigarettes",
                            }]
                        }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessageTransportation(recipientId){
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
                        title: "Categories",
                        subtitle: "Choose a category",
                        item_url: "http://nodeci.azurewebsites.net/",
                        image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                        buttons: [{
                            type: "postback",
                            title: "Ticket (Local Transport)",
                            payload: "ticket"
                        }, {
                            type: "postback",
                            title: "Taxi(Normal Tariff)",
                            payload: "taxi",
                        }, {
                            type: "postback",
                            title: "Gasoline (1 liter)",
                            payload: "gasoline",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessageUtilities(recipientId){
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
                        title: "Categories",
                        subtitle: "Choose a category",
                        item_url: "http://nodeci.azurewebsites.net/",
                        image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                        buttons: [{
                            type: "postback",
                            title: "1 min. Mobile Tariff",
                            payload: "mobile"
                        }, {
                            type: "postback",
                            title: "Internet(10 Mbps)",
                            payload: "internet",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessageSports(recipientId){
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
                        title: "Categories",
                        subtitle: "Choose a category",
                        item_url: "http://nodeci.azurewebsites.net/",
                        image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                        buttons: [{
                            type: "postback",
                            title: "Fitness Club",
                            payload: "fitness"
                        }, {
                            type: "postback",
                            title: "Cinema",
                            payload: "cinema",
                        }]
                    }]
                }
            }
        }
    };

    callSendAPI(messageData);
}

function sendGenericMessageClothing(recipientId){
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
                        title: "Categories",
                        subtitle: "Choose a category",
                        item_url: "http://nodeci.azurewebsites.net/",
                        image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                        buttons: [{
                            type: "postback",
                            title: "Pair of Jeans",
                            payload: "jeans"
                        }, {
                            type: "postback",
                            title: "Nike Shoes",
                            payload: "shoes",
                        }]
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


app.listen(app.get('port'),function(res,req) {
    console.log("running: port");
});
