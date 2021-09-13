// Change to require('pushy') to use this code in your own project
var Pushy = require('../');

// Plug in your Secret API Key
// Get it from the Pushy Dashboard: https://dashboard.pushy.me/apps
var pushy = new Pushy('SECRET_API_KEY');

// Set push payload data to deliver to device(s)
var data = {
    message: 'Hello World!'
};

// Insert target device token(s), or set to Pub/Sub topic
var to = ['DEVICE_TOKEN'];

// Set optional push notification options (such as iOS notification fields)
var options = {
    notification: {
        badge: 1,
        sound: 'ping.aiff',
        body: 'Hello World \u270c'
    },
};

// Send push notification using the Send Notifications API
pushy.sendPushNotification(data, to, options, function (err, id) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log success
    console.log('Push sent successfully! (ID: ' + id + ')');
});

// Check the delivery status of your push notifications using the Notification Status API
pushy.getNotificationStatus('PUSH_ID', function (err, status) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log notification status
    console.log('Notification Status: ', JSON.stringify(status, null, 2));
});

// Permanently delete a pending notification using the Notification Deletion API
pushy.deletePushNotification('PUSH_ID', function (err) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log success
    console.log('Pending notification deleted successfully');
});