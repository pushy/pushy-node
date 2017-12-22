# pushy-node
[![npm version](https://badge.fury.io/js/pushy.svg)](https://www.npmjs.com/package/pushy)

The official Node.js package for sending push notifications with [Pushy](https://pushy.me/).

> [Pushy](https://pushy.me/) is the most reliable push notification gateway, perfect for real-time, mission-critical applications.

**Note:** If you don't have an existing Node.js project, consider using our [sample Node.js API project](https://github.com/pushy-me/pushy-node-backend) as a starting point to make things easier for you.

## Usage

First, install the package using npm:

```shell
npm install pushy --save
```

Then, use the following sample code to send a push notification to target devices:

```js
var Pushy = require('pushy');

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
```

Alternatively, send the notification using promises:

```js
pushy.sendPushNotification(data, tokens, options)
    .then(function (id) {
        // Log success
        console.log('Push sent successfully! (ID: ' + id + ')');
    }).catch(function (err) {
        // Log errors to console
        return console.log(err);
    });
```

Make sure to replace `SECRET_API_KEY` with your app's Secret API Key listed in the [Dashboard](https://dashboard.pushy.me/). 

## License

[Apache 2.0](LICENSE)
