var request = require('request');
var Promise = require('bluebird');

// Pushy API endpoint
var apiEndpoint = 'https://api.pushy.me';

// Package constructor
function Pushy(apiKey) {
    // Make sure the developer provided his/her API key
    if (!apiKey) {
        throw new Error('Please provide your API key to use this package.');
    }

    // Check for alphanumeric API key
    if (!apiKey.match(/^[0-9a-zA-Z]+$/)) {
        throw new Error('Please provide a valid, alphanumeric API key.');
    }

    // Save it for later
    this.apiKey = apiKey;
}

// Main package function
Pushy.prototype.sendPushNotification = function (data, recipient, options, callback) {
    // Keep track of instance 'this'
    var that = this;

    // Always return a promise
    return new Promise(function (resolve, reject) {
        // Custom callback provided?
        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // No data provided?
        if (!data) {
            return reject(new Error('Please provide the push payload to send to devices.'));
        }

        // Data must be an object
        if ((Object.prototype.toString.call(data) !== '[object Object]')) {
            return reject(new Error('Please provide the push payload as an object.'));
        }

        // No recipient provided?
        if (!recipient) {
            return reject(new Error('Please provide the notification recipient.'));
        }

        // Prepare JSON post data (defaults to options object)
        var postData = options;

        // Set payload and device tokens
        postData.data = data;

        // Recipient provided as string?
        if (typeof recipient === 'string') {
            // Set "to" parameter
            postData.to = recipient;
        }
        else if (Array.isArray(recipient)) {
            // Set "tokens" parameter
            postData.tokens = recipient;
        }
        else {
            // Invalid recipient type
            return reject(new Error('Please provide the notification recipient as a string or an array of strings.'));
        }

        // Options must be an object
        if (Object.prototype.toString.call(options) !== '[object Object]') {
            return reject(new Error('Please provide the options parameter as an object.'));
        }

        // Callback must be a function (if provided)
        if (callback && typeof callback !== 'function') {
            return reject(new Error('Please provide the callback parameter as a function.'));
        }

        // Send push using the "request" package
        request({
            uri: that.getApiEndpoint() + '/push?api_key=' + that.apiKey,
            method: 'POST',
            json: postData
        }, function (err, res, body) {
            // Request error?
            if (err) {
                // Send to callback
                return reject(err);
            }

            // Missing body?
            if (!body) {
                return reject(new Error('An empty body was received from the Pushy API.'));
            }

            // Pushy error?
            if (body.error) {
                return reject(new Error(body.error));
            }

            // Check for 200 OK
            if (res.statusCode != 200) {
                return reject(new Error('An invalid response code was received from the Pushy API.'));
            }

            // Fetch push notification ID
            var pushId = body.id;

            // Callback?
            if (callback) {
                // Pass push ID to callback with a null error
                callback(null, pushId);
            }
            else {
                // Resolve the promise
                resolve(pushId);
            }
        });
    });
};

// Support for Pushy Enterprise
Pushy.prototype.setEnterpriseConfig = function (endpoint) {
    this.enterpriseEndpoint = endpoint;
}

// API endpoint selector
Pushy.prototype.getApiEndpoint = function () {
    return (this.enterpriseEndpoint) ? this.enterpriseEndpoint : apiEndpoint;
}

// Expose the Pushy object
module.exports = Pushy;