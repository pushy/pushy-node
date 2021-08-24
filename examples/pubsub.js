// Change to require('pushy') to use this code in your own project
var Pushy = require('..');

// Plug in your Secret API Key
// Get it here: https://dashboard.pushy.me/
var pushy = new Pushy('SECRET_API_KEY');

// Retrieve a list of your app's topics and subscribers count using the Pub/Sub Topics API
pushy.getTopics((err, topics) => {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    // Log subscribed topics
    console.log('Subscribed topics: \n' + JSON.stringify(topics, null, 2));
});

// Retrieve a list of devices subscribed to a certain topic using the Pub/Sub Subscribers API
pushy.getSubscribers('news', (err, subscribers) => {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    // Log subscribed devices
    console.log('Devices subscribed to topic: \n' + JSON.stringify(subscribers, null, 2));
});

// Subscribe a device to topics using the Pub/Sub Subscribe API
pushy.subscribe(['news', 'weather'], 'TOKEN', (err) => {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    // Log success
    console.log('Subscribed device to topic(s) successfully');
});

// Unsubscribe a device from topics using the Pub/Sub Unsubscribe API
pushy.unsubscribe(['news', 'weather'], 'TOKEN', (err) => {
    // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    // Log success
    console.log('Unsubscribed device from topic(s) successfully');
});