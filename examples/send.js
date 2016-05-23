// Change to 'pushy-node' to use this code in your own project
var Pushy = require('../');

// Plug in your Secret API Key
// Get it here: https://app.pushy.me/
var pushyAPI = new Pushy('SECRET_API_KEY');

// Set push payload data to deliver to device(s)
var data = {
    message: 'Hello World!'
};

// Insert target device token(s) here
var tokens = ['DEVICE_REGISTRATION_ID'];

// Set optional push notification options (such as TTL)
var options = {
    // Set the notification to expire if not delivered within 30 seconds
    time_to_live: 30
};

// Send push notification via the Push Notifications API
// https://pushy.me/docs/api/push-notifications
pushyAPI.sendPushNotification(data, tokens, options, function (err, id) {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }
    
    // Log success
    console.log('Push sent successfully! (ID: ' + id + ')');
});
