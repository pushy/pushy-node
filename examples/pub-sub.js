// Change to require('pushy') to use this code in your own project
var Pushy = require('../');

// Plug in your Secret API Key
// Get it here: https://dashboard.pushy.me/
var pushy = new Pushy('SECRET_API_KEY');


pushy.subscribeTopics(['news', 'weather'], 'TOKEN', (err, body) => {
       // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }
    console.log(body);

});

pushy.getTopics((err, body) => {
       // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }
    console.log(body);

});

pushy.unsubscribeTopics(['news'], 'TOKEN', (err, body) => {
       // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }

    console.log(body);
});

pushy.getTopicSubscribers('news', (err, body) => {
      // Log errors to console
    if (err) {
        return console.log('Fatal Error', err);
    }
    console.log(body);

});