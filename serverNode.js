const express = require('express');
const app = express();
const path = require('path');
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

// This responds a POST request for the homepage
app.post('/sendMessage', (req, res) => {
       
    // using fb-messenger api to send message to users
    let broadcastMessage = req.body.message;
    let FBMessenger = require('fb-messenger');
    let messenger = new FBMessenger("EAAFpsSI1Pa8BAMqryJlniwRwu14cu62thAMbB65BFYZBI9Wo5kVXNI9WbQ9AxbJLhY7fttZCy1ZBN8FZCmolNDVpf5nqi0vMNrPMoeyZBAqiZBAaZBWvJXZBlv3ZCp65zIry13EPiq3kdT0chJCVellVMNRBTFtJUbJdv2fskX8p2tAZDZD");
  
        messenger.sendTextMessage(2066657673406251, broadcastMessage, function (err, body) {
            if(err) return console.error(err)
        });

    //Telegram push implementation
    const { TelegramClient } = require('messaging-api-telegram');
	const client = TelegramClient.connect('696494774:AAHCl0iDVjrlW9SJKMrBGYH0Wg2derP_UDI');
	client.sendMessage(630541527, broadcastMessage, {
		disable_web_page_preview: true,
		disable_notification: true,
	});

	//LINE push implementation
	const { LineClient } = require('messaging-api-line');
	const lineClient = LineClient.connect({
		accessToken: 'SSNCPSWb+coEiOyImtsxyWVPmE794k0i4u8L3TqeWkePg6bo/Js4jcJGmxm6/mNOxlbCI9KTVsJvo85wOi7Sl94RpUATdMpnu4MOBYBHVkf0E0S9/l5NikVVY85pOs/yZD9nOjofic1+EAd6vXh/PgdB04t89/1O/w1cDnyilFU=',
		channelSecret: 'a08de6ed48375aa45f1315bb2107a2ec',
	});
	lineClient.pushText('U31d231e97cb0a19698a693d6ceab0dfd', broadcastMessage);

	res.send('Message has been broadcast.');
});


app.listen(3000, () => console.log('server listening on port 3000!'))