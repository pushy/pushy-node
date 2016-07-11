# pushy-node
[![npm version](https://badge.fury.io/js/pushy-node.svg)](https://www.npmjs.com/package/pushy-node)

The official Node.js package for sending push notifications with [Pushy](https://pushy.me/).

> [Pushy](https://pushy.me/) is the most reliable push notification gateway, perfect for real-time, mission-critical applications.

## Usage

First, install the package using npm:

```shell
npm install pushy-node --save
```

Then, use the following sample code to send a push notification to target devices:

```js
var Pushy = require('pushy-node');

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
```

Alternatively, send the notification using promises:

```js
pushyAPI.sendPushNotification(data, tokens, options)
    .then(function (id) {
        // Log success
        console.log('Push sent successfully! (ID: ' + id + ')');
    }).catch(function (err) {
        // Log errors to console
        return console.log(err);
    });
```

Make sure to replace `SECRET_API_KEY` with your app's Secret API Key, which you can find in the [Developer Dashboard](https://app.pushy.me/). 

## License

Apache 2.0
