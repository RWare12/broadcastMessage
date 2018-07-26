const express = require('express');
const app = express();
const path = require('path');
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

/*
	Access token and ID's are hardcoded for checking the broadcasted message in different channels. 
	In case for big set of users, We suggest that each platform have seperate database for the user
	ID's and necessary requirements that is needed for push message.
*/

// This responds a POST request for the homepage
app.post('/sendMessage', (req, res) => {
       
    // using fb-messenger api to send message to users
    let broadcastMessage = req.body.message;
    let FBMessenger = require('fb-messenger');
    let messenger = new FBMessenger('<ACCESS_TOKEN>');
  
        messenger.sendTextMessage('<USER_ID>', broadcastMessage, function (err, body) {
            if(err) return console.error(err)
        });

	//Telegram push implementation
	/**
	 * access token will be given by the 'BotFather' from Telegram
	 */
    const { TelegramClient } = require('messaging-api-telegram');
	const client = TelegramClient.connect('<ACCESS_TOKEN>');
	client.sendMessage('<USER_ID>', broadcastMessage, {
		disable_web_page_preview: true,
		disable_notification: true,
	});

	//LINE push implementation
	/**
	 * accessToken and channelSecret will be at 'https://at.line.me/en/' upon signing in
	 * go to Account->YourBot. The left panel go to Settings->Messaging API Settings then click on
	 * Line Developers.
	 */
	const { LineClient } = require('messaging-api-line');
	const lineClient = LineClient.connect({
		accessToken: '<ACCESS_TOKEN>',
		channelSecret: '<CHANNEL_SECRET>',
	});
	lineClient.pushText('<USER_ID>', broadcastMessage);

	//Skype proactive message implementation
	var restify = require('restify');
	var builder = require('botbuilder');
	/**
	 * The appId and appPassword will be give at 'https://dev.botframework.com'
	 */
	var connector = new builder.ChatConnector({
		appId: '<APP_ID>', 
		appPassword: '<APP_PASSWORD>' 
	});
	var bot = new builder.UniversalBot(connector);
	/**
	 * Requirements for push message in Skype are the 'channelId', 'id', 'user', 'conversation'
	 * and 'botDetails'.
	 */
	let channelId = 'skype';
	let id = '1532...';
	var user = { id: '29:1T1J6j38nSfaK...' };
	let conversation = { id: '29:1T1J6j38n...' };
	let botDetails = { name: '<YOURBOT>',
   			  id: '28:14c384d2-831...' };
	let serviceUrl = 'https://smba.trafficmanager.net/apis/';
        let address = {id, channelId, user, conversation, botDetails, serviceUrl};
        var msg = new builder.Message().address(address);
        msg.text(broadcastMessage);
        msg.textLocale('en-US');
        bot.send(msg);

	res.send('Message has been broadcast.');
});


app.listen(3000, () => console.log('server listening on port 3000!'))
