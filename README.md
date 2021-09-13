# pushy-node
[![npm version](https://badge.fury.io/js/pushy.svg)](https://www.npmjs.com/package/pushy)

The official Node.js package for sending push notifications with [Pushy](https://pushy.me/).

> [Pushy](https://pushy.me/) is the most reliable push notification gateway, perfect for real-time, mission-critical applications.

**Note:** If you don't have an existing Node.js project, consider using our [Node.js backend API sample project](https://github.com/pushy-me/pushy-node-backend) as a starting point to make things easier for you.

## Usage

First, install the package using npm:

```shell
npm install pushy --save
```

Then, use the following code to send a push notification to target devices using the [Send Notifications API](https://pushy.me/docs/api/send-notifications):

```js
var Pushy = require('pushy');

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
```

**Note:** Make sure to replace `SECRET_API_KEY` with your app's Secret API Key, available in the [Pushy Dashboard](https://dashboard.pushy.me/apps) (Click your app -> API Authentication tab). 

--- 

The library also supports using promise syntax instead of callbacks for all API methods:

```js
pushy.sendPushNotification(data, tokens, options)
    .then(function (id) {
        // Log success
        console.log('Push sent successfully! (ID: ' + id + ')');
    }).catch(function (err) {
        // Log errors to console
        return console.error(err);
    });
```

---

# Push APIs

## pushy.sendPushNotification(data, to, options)

Instantly send push notifications to your users using the [Send Notifications API](https://pushy.me/docs/api/send-notifications) (see example above):

```js
pushy.sendPushNotification(data, to, options, function (err, id) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }
    
    // Log success
    console.log('Push sent successfully! (ID: ' + id + ')');
});
```

## pushy.getNotificationStatus(pushId)

Check the delivery status of your push notifications using the [Notification Status API](https://pushy.me/docs/api/notification-status):

```js
pushy.getNotificationStatus('PUSH_ID', function (err, status) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log notification status
    console.log('Notification Status: ', JSON.stringify(status, null, 2));
});
```

## pushy.deletePushNotification(pushId)

Permanently delete a pending notification using the [Notification Deletion API](https://pushy.me/docs/api/notification-deletion):

```js
pushy.deletePushNotification('PUSH_ID', function (err) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log success
    console.log('Pending notification deleted successfully');
});
```

# Device APIs

## pushy.getDeviceInfo(deviceToken)

Fetch device info, presence, undelivered notifications, and more by device token using the [Device Info API](https://pushy.me/docs/api/device):

```js
pushy.getDeviceInfo('DEVICE_TOKEN', function (err, deviceInfo) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log device info
    console.log('Device Info: ', JSON.stringify(deviceInfo, null, 2));
});
```

## pushy.getDevicePresence(deviceTokens)

Check the presence and connectivity status of multiple devices using the [Device Presence API](https://pushy.me/docs/api/device-presence):

```js
pushy.getDevicePresence(['DEVICE_TOKEN', 'DEVICE_TOKEN_2'], function (err, devicePresence) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log device presence array
    console.log('Device Presence: ', JSON.stringify(devicePresence, null, 2));
});
```

# Pub/Sub APIs

## pushy.getTopics()

Retrieve a list of your app's topics and subscribers count using the [Pub/Sub Topics API](https://pushy.me/docs/api/pubsub-topics):

```js
pushy.getTopics(function (err, topics) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log subscribed topics
    console.log('Subscribed topics: \n' + JSON.stringify(topics, null, 2));
});
```

## pushy.getSubscribers(topic)

Retrieve a list of devices subscribed to a certain topic using the [Pub/Sub Subscribers API](https://pushy.me/docs/api/pubsub-subscribers):

```js
pushy.getSubscribers('news', function (err, subscribers) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log subscribed devices
    console.log('Devices subscribed to topic: \n' + JSON.stringify(subscribers, null, 2));
});
```

## pushy.subscribe(topics, deviceToken)

Subscribe a device to one or more topics using the [Pub/Sub Subscribe API](https://pushy.me/docs/api/pubsub-subscribe):

```js
pushy.subscribe(['news', 'weather'], 'DEVICE_TOKEN', function (err) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log success
    console.log('Subscribed device to topic(s) successfully');
});
```

## pushy.unsubscribe(topics, deviceToken)

Unsubscribe a device from one or more topics using the [Pub/Sub Unsubscribe API](https://pushy.me/docs/api/pubsub-unsubscribe)

```js
pushy.unsubscribe(['news', 'weather'], 'DEVICE_TOKEN', function (err) {
    // Log errors to console
    if (err) {
        return console.error(err);
    }

    // Log success
    console.log('Unsubscribed device from topic(s) successfully');
});
```

## License

[Apache 2.0](LICENSE)
