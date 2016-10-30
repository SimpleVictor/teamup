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
                           buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
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


/*
*
*
* NEW FUNCTIONS
*
* */





//Queries

function FindWithSkill(intent, session, callback){
    const cardTitle = intent.name;
    const FindWithSkill = intent.slots.SkillList;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    if (FindWithSkill) {
        const myFindWithSkill = FindWithSkill.value;

        let obj = {
            active: 1,
            respond: "dsds"
        };

        requests({
            url: `https://alexatrader-e9921.firebaseio.com/Listener/FindWithSkill.json`,
            method: "Patch",
            body: obj,
            json: true
        }, function(err, response){
            if(err){
                console.log("There was an error");
                console.log(err);
                speechOutput = "There was a problem with the database when trying to find with skill";
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }else{
                console.log("Succesffully reached the FindWithSkill Intent");
                speechOutput = `Here are the list of users with those skill sets`;
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            };
        });

    } else {
        speechOutput = "Please look at the command list if you do not know any?";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function FindWhoNeedsTeam(intent, session, callback){
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    let obj = {
        active: 1,
        respond: "looking for users who needs a team"
    };

    requests({
        url: `https://alexatrader-e9921.firebaseio.com/Listener/FindWhoNeedsTeam.json`,
        method: "Patch",
        body: obj,
        json: true
    }, function(err, response){
        if(err){
            console.log("There was an error");
            console.log(err);
            speechOutput = "Please look at the command list if you do not know any?";
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }else{
            speechOutput = `Here are the users that needs a team`;
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        };
    });
}

function FindIndividualName(intent, session, callback){
    const cardTitle = intent.name;
    const UserName = intent.slots.UserName;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    if (UserName) {
        const myUserName = UserName.value;

        let obj = {
            active: 1,
            respond: `Looking at ${myUserName}`
        };

        requests({
            url: `https://alexatrader-e9921.firebaseio.com/Listener/FindIndividualName.json`,
            method: "Patch",
            body: obj,
            json: true
        }, function(err, response){
            if(err){
                console.log("There was an error");
                console.log(err);
                speechOutput = "There was a problem with the database when trying to find with skill";
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }else{
                speechOutput = `Here is the team you have requested`;
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            };
        });

    } else {
        speechOutput = "Please look at the command list if you do not know any?";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function FindDescriptionProject(intent, session, callback){
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    let obj = {
        active: 1,
        respond: "showing description projects only"
    };

    requests({
        url: `https://alexatrader-e9921.firebaseio.com/Listener/FindDescriptionProject.json`,
        method: "Patch",
        body: obj,
        json: true
    }, function(err, response){
        if(err){
            console.log("There was an error");
            console.log(err);
            speechOutput = "Please look at the command list if you do not know any?";
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }else{
            speechOutput = `Here are the users that needs a team`;
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        };
    });
}

function FindSpecificTeam(intent, session, callback){
    const cardTitle = intent.name;
    const TeamName = intent.slots.TeamName;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    if (TeamName) {
        const myTeamName = TeamName.value;

        let obj = {
            active: 1,
            respond: `Looking at ${myTeamName}`
        };

        requests({
            url: `https://alexatrader-e9921.firebaseio.com/Listener/FindSpecificTeam.json`,
            method: "Patch",
            body: obj,
            json: true
        }, function(err, response){
            if(err){
                console.log("There was an error");
                console.log(err);
                speechOutput = "There was a problem with the database when trying to find with skill";
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }else{
                speechOutput = `Here is the team you have requested`;
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            };
        });

    } else {
        speechOutput = "Please look at the command list if you do not know any?";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

//Choosing an option

function ChooseTeamMember(intent, session, callback){
    const cardTitle = intent.name;
    const ScreenID = intent.slots.ScreenID;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = true;
    let speechOutput = '';

    if (ScreenID) {
        const myScreenID = ScreenID.value;

        let obj = {
            active: 1,
            respond: `You have chosen a team member to look at his profile`
        };

        requests({
            url: `https://alexatrader-e9921.firebaseio.com/Listener/ChooseTeamMember.json`,
            method: "Patch",
            body: obj,
            json: true
        }, function(err, response){
            if(err){
                console.log("There was an error");
                console.log(err);
                speechOutput = "There was a problem with the database when trying to find with skill";
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            }else{
                speechOutput = `Here is the member you have requested to see`;
                callback(sessionAttributes,
                    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
            };
        });

    } else {
        speechOutput = "Please look at the command list if you do not know any?";
        callback(sessionAttributes,
            buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    }
}

function LookUpHisTeamMate(intent, session, callback){
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    let obj = {
        active: 1,
        respond: "Showing the team member's group"
    };

    requests({
        url: `https://alexatrader-e9921.firebaseio.com/Listener/LookUpHisTeamMate.json`,
        method: "Patch",
        body: obj,
        json: true
    }, function(err, response){
        if(err){
            console.log("There was an error");
            console.log(err);
            speechOutput = "Please look at the command list if you do not know any?";
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }else{
            speechOutput = `Here are the teams for that current user you requested`;
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        };
    });
}

//Requesting

function RequestToTextTeamParty(intent, session, callback){

}

function RequestToJoinTeam(intent, session, callback){

}

function RequestToTextIndividual(intent, session, callback){

}

function GoToMainMenu(intent, session, callback){
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    let obj = {
        active: 1,
        respond: "Going back to main menu"
    };

    requests({
        url: `https://alexatrader-e9921.firebaseio.com/Listener/GoToMainMenu.json`,
        method: "Patch",
        body: obj,
        json: true
    }, function(err, response){
        if(err){
            console.log("There was an error");
            console.log(err);
            speechOutput = "Please look at the command list if you do not know any?";
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }else{
            speechOutput = `Going back to the main menu now`;
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        };
    });
}

function GoBackACommand(intent, session, callback){
    const cardTitle = intent.name;
    let repromptText = '';
    let sessionAttributes = {};
    const shouldEndSession = false;
    let speechOutput = '';

    let obj = {
        active: 1,
        respond: "Going back to main menu"
    };
    requests({

        url: `https://alexatrader-e9921.firebaseio.com/Listener/GoBackACommand.json`,
        method: "Patch",
        body: obj,
        json: true
    }, function(err, response){
        if(err){
            console.log("There was an error");
            console.log(err);
            speechOutput = "Please look at the command list if you do not know any?";
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        }else{
            speechOutput = `Changing your view now`;
            callback(sessionAttributes,
                buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
        };
    });
}



/*
 *
 *
 * NEW FUNCTIONS (ENDING)
 *
 * */

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
    }


    ///////////////////////////////////////NEW FUNCTIONS//////////////////////////////////////

    //FIND SOMEONE WITH **
    else if(intentName === 'FindWithSkill'){ //Alexa, tell team up to show me people with angularjs experience
        FindWithSkill(intent, session, callback);
    }else if(intentName === 'FindWhoNeedsTeam'){ //Alexa, tell team up to show me people who needs a team
        FindWhoNeedsTeam(intent, session, callback);
    }else if(intentName === 'FindIndividualName'){ //Alexa, tell team up to look at {slot} profile
        FindIndividualName(intent, session, callback);
    }else if(intentName === 'FindDescriptionProject'){ //Alexa, tell team up to just look for project's description only
        FindDescriptionProject(intent, session, callback);
    }else if(intentName === 'FindSpecificTeam'){ //Alexa, tell team up to look up {{John Doe}} team
        FindSpecificTeam(intent, session, callback);
    }
    //CHOOSING AN OPTION
    //This is after a query was asked for and now we need to choose someone
    else if(intentName === 'ChooseTeamMember'){ //Alexa, tell team up to look at profile number {{number}}
        //We will display 10 Members at a time. And we would choose who
        ChooseTeamMember(intent, session, callback);
    }else if(intentName === 'LookUpHisTeamMate'){ //Alexa, tell team up to look at the member's team
        //At this point we will be in the individual's profile
        //We need to set up a local variable when this does happen
        LookUpHisTeamMate(intent, session, callback);
    }
    //REQUEST TEAM FORMATION
    else if(intentName === 'RequestToTextTeamParty'){ //Alexa, tell team up to send a text to this team
        RequestToEmailTeamParty(intent, session, callback);
    }else if(intentName === 'RequestToJoinTeam'){//Alexa, tell team up to send request to join this team
        RequestToJoinTeam(intent, session, callback);
    }else if(intentName === 'RequestToTextIndividual'){ //Alexa, tell team up to send a text to this user
        RequestToTextIndividual(intent, session, callback);
    }
    //UNIVERSAL
    else if(intentName === 'GoToMainMenu'){ //Alexa, tell team up to go back to the main menu
        GoToMainMenu(intent, session, callback);
    }else if(intentName === 'GoBackACommand'){ //Alexa, tell team up to go back
        GoBackACommand(intent, session, callback);
    }
    //DEFAULT COMMANDS FROM ALEXA
    else if (intentName === 'AMAZON.HelpIntent') {
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
