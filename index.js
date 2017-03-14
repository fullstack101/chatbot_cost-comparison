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
let botID=638196106390731;

app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging;
    //let frame="";
    console.log("DOGE");
    console.log("Events: "+messaging_events);
    console.log("Length: "+messaging_events.length);
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;
        console.log("Sender: "+sender);
        //sendText(sender, "Frame: "+frame);
        console.log("message: "+ event.message);
        console.log("text: "+event.message.text);
        if (event.message && event.message.text && sender!=botID) {
            let text = event.message.text;
            console.log("Frame: "+frame);
            let greeting = "Hi, do you want to see a cost comparison between your city and Blagoevgrad, Bulgaria?";

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
                        frame="answer";
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
                        sendText(sender, "Thank you messaging us. Goodbye");
                        frame="";
                    }
                    else
                    {
                        sendText(sender, "The bot can't answer these questions. A person from admissions office will answer as soon as possible.");
                        frame="";
                    }
                    break;
                case "city":
                    console.log("city");
                    sendText(sender, text+" is a nice city.");
                    sendText(sender, "What comparison category do you want to see?");
                    sendGenericMessagePriceType(sender);
                    frame="choice1";
                    break;
                case "answer":
                    if(text=="chat with bot")
                    {
                        sendText(sender, "Where are you from?");
                        frame="city";
                    }
                    else
                    {
                        sendText(sender, "Opening website. Thank you messaging us. Goodbye.");
                        frame="";
                    }
                    break;
                case "choice1":
                    if(text="Restaurants")
                    {
                        sendGenericMessageRestaurants(sender);
                        frame="choice2";
                    }
                    else if(text == "Markets")
                    {
                        sendGenericMessageMarkets(sender);
                        frame="choice2";
                    }
                    else if(text == "Transportation")
                    {
                        sendGenericMessageTransportation(sender);
                        frame="choice2";
                    }
                    else if(text == "Utilities(Monthly)")
                    {
                        sendGenericMessageUtilities(sender);
                        frame="choice2";
                    }
                    else if(text == "Sports and Leisure")
                    {
                        sendGenericMessageSports(sender);
                        frame="choice2";
                    }
                    else if(text == "Clothing and Shoes")
                    {
                        sendGenericMessageClothing(sender);
                        frame="choice2";
                    }
                    else if(text=="quit")
                    {
                        sendText(sender,"Thank you messaging us. Goodbye.");
                        frame="";
                    }
                    else
                    {
                        sendText(sender, "Cannot recognise answer. Select one of the options or write quit to end the conversation.");
                        sendGenericMessagePriceType(sender);
                    }
                    break;
            }
        }
        else if (event.postback){
            let payload = event.postback.payload;
            sendText(sender,"The payload is: "+payload);
        }

    }
    res.sendStatus(200)
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
                            payload: "Payload for first button"
                        }, {
                            type: "postback",
                            title: "Markets",
                            payload: "Payload for second button",
                        }, {
                            type: "postback",
                            title: "Transportation",
                            payload: "Payload for third button",
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
                            payload: "Payload for fourth button",
                        }, {
                            type: "postback",
                            title: "Sports and Leisure",
                            payload: "Payload for fifth button",
                        }, {
                            type: "postback",
                            title: "Clothing and Shoes",
                            payload: "Payload for sixth button",
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
                            title: "Meal, Inexpensive Restaurant",
                            payload: "Payload for first button"
                        }, {
                            type: "postback",
                            title: "McMeal at McDonalds",
                            payload: "Payload for second button",
                        }, {
                            type: "postback",
                            title: "Domestic Beer (0.5 liter draught)",
                            payload: "Payload for third button",
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
                                payload: "Payload for fourth button",
                            }, {
                                type: "postback",
                                title: "Coke/Pepsi (0.33 liter bottle)",
                                payload: "Payload for fifth button",
                            }, {
                                type: "postback",
                                title: "Water (0.33 liter bottle)",
                                payload: "Payload for sixth button",
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
                            title: "Milk (regular), (1 liter)",
                            payload: "Payload for first button"
                        }, {
                            type: "postback",
                            title: "Local Cheese (1kg)",
                            payload: "Payload for second button",
                        }, {
                            type: "postback",
                            title: "Apples (1kg)",
                            payload: "Payload for third button",
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
                                payload: "Payload for fourth button",
                            }, {
                                type: "postback",
                                title: "Bottle of Wine (Mid-Range)",
                                payload: "Payload for fifth button",
                            }, {
                                type: "postback",
                                title: "Pack of Cigarettes (Marlboro)",
                                payload: "Payload for sixth button",
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
                            title: "One-way Ticket (Local Transport)",
                            payload: "Payload for first button"
                        }, {
                            type: "postback",
                            title: "Taxi Start (Normal Tariff)",
                            payload: "Payload for second button",
                        }, {
                            type: "postback",
                            title: "Gasoline (1 liter)",
                            payload: "Payload for third button",
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
                            title: "1 min. of Prepaid Mobile Tariff Local (No Discounts or Plans)",
                            payload: "Payload for first button"
                        }, {
                            type: "postback",
                            title: "Internet (10 Mbps, Unlimited Data, Cable/ADSL)",
                            payload: "Payload for second button",
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
                            title: "Fitness Club, Monthly Fee for 1 Adult",
                            payload: "Payload for first button"
                        }, {
                            type: "postback",
                            title: "Cinema, International Release, 1 Seat",
                            payload: "Payload for second button",
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
                            title: "1 Pair of Jeans (Levis 501 Or Similar)",
                            payload: "Payload for first button"
                        }, {
                            type: "postback",
                            title: "1 Summer Dress in a Chain Store (Zara, H&M, ...)",
                            payload: "Payload for second button",
                        }]
                    },
                        {
                            title: "Categories",
                            subtitle: "Choose a category",
                            item_url: "http://nodeci.azurewebsites.net/",
                            image_url: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRP3xvk-VoiD710STywOytypn0Miyz3oa2XxkgV1frhmLQC2pPhnA",
                            buttons: [{
                                type: "postback",
                                title: "1 Pair of Nike Running Shoes (Mid-Range)",
                                payload: "Payload for fourth button",
                            }, {
                                type: "postback",
                                title: "Coke/Pepsi (0.33 liter bottle)",
                                payload: "1 Pair of Men Leather Business Shoes",
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
