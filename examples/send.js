// Change to require('pushy') to use this code in your own project
var Pushy = require('../');

// Plug in your Secret API Key
// Get it here: https://dashboard.pushy.me/
var pushy = new Pushy('SECRET_API_KEY');

// Set push payload data to deliver to device(s)
var data = {
    message: 'Hello World!'
};

// Insert target device token(s) here
var tokens = ['DEVICE_TOKEN'];

// Set optional push notification options (such as iOS notification fields)
var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        body: 'Hello World \u270c'
    },
};

// Send push notification via the Send Notifications API
// https://pushy.me/docs/api/send-notifications
pushy.sendPushNotification(data, tokens, options, function (err, id) {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }
    
    // Log success
    console.log('Push sent successfully! (ID: ' + id + ')');
});
