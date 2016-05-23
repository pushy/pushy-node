var request = require('request');

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
    // No data provided?
    if (!data) {
        return callback(new Error('Please provide the push payload to send to devices.'));
    }

    // Data must be an object
    if (typeof data !== 'object') {
        return callback(new Error('Please provide the push payload as an object.'));
    }

    // No tokens provided?
    if (!tokens) {
        return callback(new Error('Please provide the device registration IDs.'));
    }

    // Token provided as string?
    if (typeof tokens === 'string') {
        // Convert to string array 
        tokens = [tokens];
    }

    // Tokens must be an array
    if (tokens.constructor !== Array) {
        return callback(new Error('Please provide the device registration IDs as an array of strings.'));
    }

    // Require at least one token
    if (tokens.length === 0) {
        return callback(new Error('Please provide at least one device registration ID.'));
    }

    // Options must be an object
    if (typeof options !== 'object') {
        return callback(new Error('Please provide the options parameter as an object.'));
    }

    // Callback must be a function
    if (typeof callback !== 'function') {
        return callback(new Error('Please provide the callback parameter as a function.'));
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
        uri: 'https://api.pushy.me/push?api_key=' + this.apiKey,
        method: 'POST',
        json: postData
    }, function (err, res, body) {
        // Request error?
        if (err) {
            // Send to callback
            return callback(err);
        }

        // Pushy error?
        if (body.error) {
            // Send to callback
            return callback(new Error(body.error));
        }

        // Check for 200 OK
        if (res.statusCode != 200) {
            return callback(new Error('An invalid response was received from the Pushy API.'));
        }

        // Fetch push notification ID
        var pushId = body.id;

        // Pass push ID to callback
        callback(null, pushId);
    });
};

// Expose the Pushy object
module.exports = Pushy;