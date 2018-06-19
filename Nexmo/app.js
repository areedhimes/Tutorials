const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// Init Nexmo
const nexmo = new Nexmo({
    //from nexmo
    apiKey: '36d95e3c',//e2eee59b//36d95e3c//e2eee59b
    apiSecret: 'fa733040f7c84b0d'//5rfYo2B8jm7kvgku//fa733040f7c84b0d//5rfYo2B8jm7kvgku
}, { debug: true });

// Init app
const app = express();

// Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public'));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Index route
app.get('/', (req, res) => {
    res.render('index');
});

// Catch form submit
app.post('/', (req, res) => {
    //set the phone # and text msg in variables
    const number = req.body.number;
    const text = req.body.text;

    //send the messgae to nexmo
    //14142165033 is virual # from mexmo
    nexmo.message.sendSms(
        '12018957890', number, text, { type: 'unicode' },//12149832749//14142165033//12149832749
        (err, responseData) => {
            if (err) {
                //log the error if you get one
                console.log(err);
            } else {

                console.dir(responseData);
                // Get data from response
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }

                // Emit to the client
                io.emit('smsStatus', data);
            }
        }
    );
});

// Define port
const port = 3000;

// Start server
const server = app.listen(port, () => console.log(`Server started on port ${port}`));

// Connect to socket.io
const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
})