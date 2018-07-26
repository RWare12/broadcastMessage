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
    let messenger = new FBMessenger("EAAFQIPkB2ZCYBAOdx1zhYAQJrGk9e1Hj2RFj5jVmfapJYqgAlKe9cJakg44Y1Vy9dzYEbj1FbvgKsDpGyQVIyGJDG1Pelbtslxf9wzoCwkBfNtw71jtxvQHv0YLuq0t62g3t5yCtY33BZBDjrckZCH49eDeca92vXov2uKoFQZDZD");
  
        messenger.sendTextMessage(1721885347926612, broadcastMessage, function (err, body) {
            if(err) return console.error(err)
            console.log(body);
        });
    

    res.send('Message has been broadcast.');
});


app.listen(3000, () => console.log('server listening on port 3000!'))