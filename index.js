/**
 * Created by Atanas on 06-Mar-17.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');

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
let city="";
let prevFrame="";
let botID=638196106390731;

app.post('/webhook/', function(req, res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;
        let payload="";
        if (event.message && event.message.text && sender!=botID) {
            let text = event.message.text;
            decision(sender,text);
        }
        if (event.postback){
            let payload = event.postback.payload;
            decision(sender,payload);
        }


    }
    res.sendStatus(200)
});

function decision(sender,text){
    let greeting = "Hi, this is cost-comparison bot. The bot can compare the basic cost needs for students in your city and in Blagoevgrad, Bulgaria.\u000A\u000AIf you need help to navigate type 'help'\u000AIf you want to take a step back type 'back'\u000AIf you want to end the conversation type 'quit'\u000A\u000ASo let's go. Do you want to see the price comparisson between your city and Blagoevgrad?";
    if(text=="back")
    {
        switch (frame){
            case "greeting":
                sendText(sender,"Can't go back.");
                break;
            case "answer":
                frame="";
                break;
            case "askAdministration":
                frame="";
                break;
            case "city":
                frame="greeting";
                text="yes";
                break;
            case "choice1":
                frame="answer";
                text="chat";
                break;
            case "choice2":
                frame="city";
                break;
        }
    }
    if(text=="quit")
    {
        sendText(sender, "Thank you messaging us. Goodbye");
        frame="";
    }
    if(text.toLowerCase()=="help")
    {
        sendText(sender,"To go back - type 'back'. " +
            "To end conversation - type 'quit'");
    }
    else {
        switch (frame) {
            case "":
                if(text.toLowerCase()!="quit"){
                    sendText(sender, greeting);
                    frame = "greeting";
                }
                break;

            case "greeting":
                if (text.toLowerCase() == "yes") {
                    sendText(sender, "How would you prefer to check the prices?");
                    sendGenericMessage(sender);
                    frame = "answer";
                }
                else if (text.toLowerCase() != "help" && text.toLowerCase()!="back") {
                    sendText(sender, "Do you have a question to the administration?");
                    prevFrame = frame;
                    frame = "askAdministration";
                }
                break;

            case "askAdministration":
                if (text.toLowerCase() == "yes") {
                    sendText(sender, "An admission officer will contact you as soon as possible.");
                    sendText(sender, "Thank you messaging us. Goodbye");
                    frame = "";
                }
                else {
                    sendText(sender, "Thank you for messaging us. Goodbye.");
                    frame = "";
                }
                break;
            case "city":
                city = text.toLowerCase();
                sendText(sender, "What comparison category do you want to see?");
                sendGenericMessagePriceType(sender);
                frame = "choice1";
                break;
            case "answer":
                if (text == "chat") {
                    sendText(sender, "Where are you from?");
                    frame = "city";
                }
                else if (text.toLowerCase() != "help" && text.toLowerCase() != "back") {
                    sendText(sender, "Opening website. Thank you messaging us. Goodbye.");
                    frame = "";
                }
                break;
            case "choice1":
                if (text == "restaurants") {
                    sendGenericMessageRestaurants(sender);
                    frame = "choice2";
                }
                else if (text == "markets") {
                    sendGenericMessageMarkets(sender);
                    frame = "choice2";
                }
                else if (text == "transportation") {
                    sendGenericMessageTransportation(sender);
                    frame = "choice2";
                }
                else if (text == "utilities") {
                    sendGenericMessageUtilities(sender);
                    frame = "choice2";
                }
                else if (text == "sports") {
                    sendGenericMessageSports(sender);
                    frame = "choice2";
                }
                else if (text == "clothing") {
                    sendGenericMessageClothing(sender);
                    frame = "choice2";
                }
                else if (text == "quit") {
                    sendText(sender, "Thank you messaging us. Goodbye.");
                    frame = "";
                }
                else {
                    sendText(sender, "Cannot recognise answer. Select one of the options or write quit to end the conversation.");
                    sendGenericMessagePriceType(sender);
                }
                break;
            case "choice2":
                let id = "";
                if (text == "meal") {
                    id = 1;
                }
                else if (text == "McMeal") {
                    id = 3
                }
                else if (text == "beer") {
                    id = 4;
                }
                else if (text == "cappuccino") {
                    id = 114;
                }
                else if (text == "coke") {
                    id = 6;
                }
                else if (text == "water") {
                    id = 7;
                }
                else if (text == "milk") {
                    id = 8;
                }
                else if (text == "cheese") {
                    id = 12;
                }
                else if (text == "apples") {
                    id = 110;
                }
                else if (text == "potato") {
                    id = 112;
                }
                else if (text == "wine") {
                    id = 14;
                }
                else if (text == "cigarettes") {
                    id = 17;
                }
                else if (text == "ticket") {
                    id = 18;
                }
                else if (text == "taxi") {
                    id = 107;
                }
                else if (text == "gasoline") {
                    id = 24;
                }
                else if (text == "mobile") {
                    id = 32;
                }
                else if (text == "internet") {
                    id = 33;
                }
                else if (text == "fitness") {
                    id=40;
                }
                else if (text == "cinema") {
                    id = 44;
                }
                else if (text == "jeans") {
                    id=60;
                }
                else if (text == "shoes") {
                    id=64;
                }
                Promise.all([fetch("http://cost-comparison.azurewebsites.net/getItem/"+city+"/"+id).then((res) => res.json()),
                    fetch("http://cost-comparison.azurewebsites.net/getItem/Blagoevgrad/"+id).then((res) => res.json())])
                    .then(function(json) {
                        console.log(json);
                        let cost="";
                        let price;
                        if(json[0].average_price>json[1].average_price){
                            cost="cheaper";
                            price=(json[0].average_price-json[1].average_price)/json[0].average_price;
                        }
                        else if(json[0].average_price<json[1].average_price){
                            cost="more expensive";
                            price=(json[1].average_price-json[0].average_price)/json[0].average_price;
                        }
                        else{
                            cost="same price";
                            price=0;
                        }
                        price=price*100;
                        sendText(sender,"The average price in "+city+" is $"+json[0].average_price.toFixed(2)+"\u000AThe average price is Blagoevgrad is $"+ json[1].average_price.toFixed(2)+"\u000AIn Blagoevgrad is "+cost+" with "+price.toFixed(2)+"%\u000ADo you want to see something else?");
                        frame = "checkAgain";
                    });
                break;
            case "checkAgain":
                if (text.toLowerCase() == "yes") {
                    sendText(sender, "What comparison category do you want to see?");
                    sendGenericMessagePriceType(sender);
                    prevFrame = frame;
                    frame = "choice1";
                }
                else if (text.toLowerCase() == "no") {
                    sendText(sender, "Do you have a question to the administration?");
                    prevFrame = frame;
                    frame = "askAdministration";
                }
                else {
                    sendText(sender, "Cannot recognize answer. Please write yes or no.");
                }
                break;
        }
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
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                            image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
                        buttons: [{
                            type: "web_url",
                            url: "http://cost-comparison.azurewebsites.net/home",
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
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                            image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                            image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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
                        image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/American_University_in_Bulgaria.jpg/1200px-American_University_in_Bulgaria.jpg",
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


const httpJSONRequest = function (url) {
    return new Promise(function (resolve, reject) {
        console.log(url);
        let xhr = new XMLHttpRequest();

        xhr.withCredentials = false;
        xhr.open('GET', url, true);
        xhr.send();
        xhr.addEventListener("readystatechange", processRequest, false);

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = JSON.parse(xhr.responseText);
                resolve(response);
            } else if (xhr.readyState == 4) {
                console.log(xhr.readyState);
                console.log(xhr.status);
                reject(Error("Something went wrong with the request \n\t\t\t\t\t XHR Status: " + xhr.status));
            }
        }
    });
};

app.listen(app.get('port'),function(res,req) {
    console.log("running: port");
});
