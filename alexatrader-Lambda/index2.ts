'use strict';
var requests = require('request');

// --------------- Helpers that build all of the responses -----------------------

//<break time="1ms"/>

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function BuildAudioSpeech(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'SSML',
            ssml: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'SSML',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}


// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Thank for using trade please repeat the message displayed on the screen.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Are you going to tell me your unique ID or not?';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const cardTitle = 'Session Ended';
    const speechOutput = 'Alexa U X is the best. BYE!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function createFavoriteColorAttributes(favoriteColor) {
    return {
        favoriteColor,
    };
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function SetupNumber(intent, session, callback) {
    const cardTitle = intent.name;
    const myUniqueNumber = intent.slots.UniqueNumber;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    if (myUniqueNumber) {
        const UniqueNumber = myUniqueNumber.value;

        requests({
            url: `https://alexatrader-e9921.firebaseio.com/${UniqueNumber}.json`,
            method: "GET",
            json: true
        }, function(err, response){
            if(err){
                console.log("There was an error");
                console.log(err);
                speechOutput = "There was a problem connecting to the DB";
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }else{
                console.log("Found The Number");

                let obj = {
                    active: 1,
                    respond: UniqueNumber
                };

                requests({
                    url: `https://alexatrader-e9921.firebaseio.com/Listener/SetupNumber/.json`,
                    method: "Patch",
                    body: obj,
                    json: true
                }, function(err, response){
                   if(err){
                       console.log("There was an error");
                       console.log(err);
                       speechOutput = "There was a problem connecting to the DB";
                       callback(sessionAttributes,
                           BuildAudioSpeech(cardTitle, speechOutput, repromptText, shouldEndSession));
                   }else{
                       speechOutput = `You are now connected`;
                       callback(sessionAttributes,
                           buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
                   }
                });

            };
        });

    } else {
        speechOutput = "What is your number again?";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}



function RemoveGrid(intent, session, callback){
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    let obj = {
        active: 1,
        respond: "remove grid"
    };

    requests({
        url: `https://alexaux-39a68.firebaseio.com/Listener/RemoveGrid.json`,
        method: "Patch",
        body: obj,
        json: true
    }, function(err, response){
        if(err){
            console.log("There was an error");
            console.log(err);
            speechOutput = "There was a problem bro";
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }else{
            console.log("Successfully added into db");
            speechOutput = `You are now connected`;
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        };
    });
}

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'SetupNumber') {
        SetupNumber(intent, session, callback);
    }else if (intentName === 'AMAZON.HelpIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /*
         if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
         callback('Invalid Application ID');
         }
         */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
