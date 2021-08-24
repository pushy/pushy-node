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

Then, use the following code to send a push notification to target devices:

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

---

# Additional API Methods

## pushy.deletePushNotification(pushId)

Delete a notification using the [Notification Deletion API](https://pushy.me/docs/api/notification-deletion):

```js
// Unique push ID returned from pushy.sendPushNotification()
var pushId = '5ea9b214b47cad768a35f13a';

// Delete the notification
pushy.deletePushNotification(pushId)
    .then(function (id) {
        // Log success
        console.log('Push deleted successfully!');
    }).catch(function (err) {
        // Log errors to console
        return console.log(err);
    });
```

## pushy.getTopics()

Retrieve a list of your app's topics and subscribers count using the [Pub/Sub Topics API](https://pushy.me/docs/api/pubsub-topics):

```js
pushy.getTopics((err, topics) => {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    // Log subscribed topics
    console.log('Subscribed topics: \n' + JSON.stringify(topics, null, 2));
});
```

## pushy.getSubscribers(topic)

Retrieve a list of devices subscribed to a certain topic using the [Pub/Sub Subscribers API](https://pushy.me/docs/api/pubsub-subscribers):

```js
pushy.getSubscribers('news', (err, subscribers) => {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    // Log subscribed devices
    console.log('Devices subscribed to topic: \n' + JSON.stringify(subscribers, null, 2));
});
```

## pushy.subscribe(topics, deviceToken)

Subscribe a device to topics using the [Pub/Sub Subscribe API](https://pushy.me/docs/api/pubsub-subscribe):

```js
pushy.subscribe(['news', 'weather'], 'TOKEN', (err) => {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    // Log success
    console.log('Subscribed device to topic(s) successfully');
});
```

## pushy.unsubscribe(topics, deviceToken)

Unsubscribe a device from topics using the [Pub/Sub Unsubscribe API](https://pushy.me/docs/api/pubsub-unsubscribe)

```js
pushy.unsubscribe(['news', 'weather'], 'TOKEN', (err) => {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    // Log success
    console.log('Unsubscribed device from topic(s) successfully');
});
```

## pushy.getDeviceInfo(deviceToken)
Fetch device info, presence, undelivered notifications, and more by device token using [Device Info API](https://pushy.me/docs/api/device).


```js
pushy.getDeviceInfo('TOKEN', (err, deviceInfo) => {

    // Log errors to console
    if (err) {
        console.log(err);
    }

    // Log Device Information
    console.log('Device Info: ', deviceInfo);
});
```
Check the presence and connectivity status of multiple devices using [Device Presence API](https://pushy.me/docs/api/device-presence)

```js
    pushy.getDevicesPresence(['TOKEN'], (err, devicesInfo) => {
        // Log errors to console
        if (err) {
            console.log(err);
        }

        // Log Device Information
        console.log('Device Info: ', devicesInfo);
    });
```
## License

[Apache 2.0](LICENSE)
