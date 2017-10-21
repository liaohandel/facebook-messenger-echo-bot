let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

//const FACEBOOK_ACCESS_TOKEN = 'EAAEDA93cGNwBAJ6ZB2BBl1BeuMqqjYKEezbjeXK4QmY13YZC5332xKcIhz4b7vZAroal6sl4xdz5h9PDUIZC30CZBGUSP'
const FACEBOOK_ACCESS_TOKEN = 'EAAEDA93cGNwBAPYrXWvbvsCngPrIrxCk5AFnYpSCMbVQt8GHCSXKEGvbxzTXMB5UgEUx4aAEdeQyhaW02ZAQRRSoUL'
const PORT = process.env.PORT || 3000
//const VERIFY_TOKEN = 'Your_Verify_Token'
const VERIFY_TOKEN = 'handelbot0921'

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// Facebook Webhook
app.get('/', function (req, res) {
    if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    } else {
        res.send('Invalid verify token')
    }
})

// handler receiving messages
app.post('/', function (req, res) {
    let events = req.body.entry[0].messaging
    for (i = 0; i < events.length; i++) {
        let event = events[i]
        if (event.message) {
            if (event.message.text) {
                sendMessage(event.sender.id, { text: event.message.text })
            }
        }
    }
    res.sendStatus(200)
})

// generic function sending messages
function sendMessage(recipientId, message) {
    let options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }
    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
