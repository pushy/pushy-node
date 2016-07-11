var request = require('request');
var Promise = require('bluebird');

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
Pushy.prototype.sendPushNotification = function (data, tokens, options, callback) {
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
        if (typeof data !== 'object') {
            return reject(new Error('Please provide the push payload as an object.'));
        }

        // No tokens provided?
        if (!tokens) {
            return reject(new Error('Please provide the device registration IDs.'));
        }

        // Token provided as string?
        if (typeof tokens === 'string') {
            // Convert to string array 
            tokens = [tokens];
        }

        // Tokens must be an array
        if (tokens.constructor !== Array) {
            return reject(new Error('Please provide the device registration IDs as an array of strings.'));
        }

        // Require at least one token
        if (tokens.length === 0) {
            return reject(new Error('Please provide at least one device registration ID.'));
        }

        // Options must be an object
        if (typeof options !== 'object') {
            return reject(new Error('Please provide the options parameter as an object.'));
        }

        // Callback must be a function (if provided)
        if (callback && typeof callback !== 'function') {
            return reject(new Error('Please provide the callback parameter as a function.'));
        }

        // Prepare JSON post data
        var postData = {
            data: data,
            registration_ids: tokens
        };

        // Developer provided TTL via options?
        if (options.time_to_live) {
            postData.time_to_live = options.time_to_live;
        }

        // Send push using the "request" package
        request({
            uri: 'https://api.pushy.me/push?api_key=' + that.apiKey,
            method: 'POST',
            json: postData
        }, function (err, res, body) {
            // Request error?
            if (err) {
                // Send to callback
                return reject(err);
            }

            // Pushy error?
            if (body.error) {
                // Send to callback
                return reject(new Error(body.error));
            }

            // Check for 200 OK
            if (res.statusCode != 200) {
                return reject(new Error('An invalid response was received from the Pushy API.'));
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

// Expose the Pushy object
module.exports = Pushy;