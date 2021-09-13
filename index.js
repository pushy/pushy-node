// Pushy API endpoint
var apiEndpoint = 'https://api.pushy.me';

// Package constructor
function Pushy(apiKey) {
    // Make sure the developer provided an API key
    if (!apiKey) {
        throw new Error('Please provide your Secret API key to use this package.');
    }

    // Check for alphanumeric API key
    if (!apiKey.match(/^[0-9a-zA-Z]+$/)) {
        throw new Error('Please provide a valid, alphanumeric API key.');
    }

    // Save it for later
    this.apiKey = apiKey;
}

// Push APIs
Pushy.prototype.sendPushNotification = require('./api/push/send');
Pushy.prototype.getNotificationStatus = require('./api/push/status');
Pushy.prototype.deletePushNotification = require('./api/push/delete');

// Device APIs
Pushy.prototype.getDeviceInfo = require('./api/device/info');
Pushy.prototype.getDevicePresence = require('./api/device/presence');

// Pub/Sub APIs
Pushy.prototype.getTopics = require('./api/pubsub/topics');
Pushy.prototype.subscribe = require('./api/pubsub/subscribe');
Pushy.prototype.unsubscribe = require('./api/pubsub/unsubscribe');
Pushy.prototype.getSubscribers = require('./api/pubsub/subscribers');

// API endpoint selector
Pushy.prototype.getApiEndpoint = function () {
    return (this.enterpriseEndpoint) ? this.enterpriseEndpoint : apiEndpoint;
}

// Support for Pushy Enterprise
Pushy.prototype.setEnterpriseConfig = function (endpoint) {
    this.enterpriseEndpoint = endpoint;
}

// Add extra options that will be passed to the request library
Pushy.prototype.setExtraRequestOptions = function (extraRequestOptions) {
    this.extraRequestOptions = extraRequestOptions;
}

// Expose the Pushy object
module.exports = Pushy;