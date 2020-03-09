// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, ActionTypes, ActivityTypes, CardFactory } = require('botbuilder');
var t = this.messageCount;
class EchoBot extends ActivityHandler {

    constructor() {
        super();

        this.onMembersAdded(async (context, next) => {
            await this.sendWelcomeMessage(context);

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            const currentResponse = context.activity.text;
            const currentMessageCount = context.messageCount;
            console.log(currentResponse);
            if (currentMessageCount == 2 || currentResponse == 'help') {
                await this.sendSuggestedActions(context);
            }
            else if (currentResponse == 'Show me some dogs!') {
                const reply = { type: ActivityTypes.Message };
                reply.text = 'This is my best friend.';
                reply.attachments = [this.getInternetAttachment()];
                await context.sendActivity(reply);
            }
            else if (currentResponse == 'Play fetch') {
                await this.sendBarkResponse(context);

            }
            else {
                await this.sendBarkResponse(context);
            }

            context.messageCount++;
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });


    }

    //#region Response constructors
    async sendWelcomeMessage(turnContext) {
        const membersAdded = turnContext.activity.membersAdded;
        const welcomeText = 'Hello, I am BarkBot! Bark bark!';

        for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
            if (membersAdded[cnt].id !== turnContext.activity.recipient.id) {
                await turnContext.sendActivity(MessageFactory.text(welcomeText, welcomeText));
            }
        }
    }

    async sendBarkResponse(turnContext) {
        let replyText = `Bark bot: ${turnContext.activity.text}`;
        let barkResponse = this.barkBuilder(turnContext.activity.text);
        // await turnContext.sendActivity(MessageFactory.text(replyText, replyText));
        replyText = `${barkResponse}`;
        await turnContext.sendActivity(MessageFactory.text(replyText, replyText));
    }

    async sendSuggestedActions(turnContext) {
        var reply = MessageFactory.suggestedActions(['Show me some dogs!', 'Play fetch', 'Blue'], 'I can do a lot more than bark y\'know....bark bark!');
        await turnContext.sendActivity(reply);
    }
    //#endregion

    // #region Helper functions
    // Contructs a semi random string of bark
    barkBuilder(bark) {
        let times = Math.floor((Math.random() * 10) + 1);
        let barkResponse = "";
        for (var i = 0; i < times; i++) {
            if (i == (times - 1)) {
                barkResponse += "bark!";
            }
            else {
                barkResponse += "bark ";
            }
        }
        return barkResponse;
    }

    getInternetAttachment() {
        // NOTE: The contentUrl must be HTTPS.
        return {
            name: 'giphy.gif',
            contentType: 'image/gif',
            contentUrl: 'https://media.giphy.com/media/PJkRFTRNtXJjq/giphy.gif'
        };
    }
    // #endregion
}

module.exports.EchoBot = EchoBot;
