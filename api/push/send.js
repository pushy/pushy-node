var request = require('request');
var Promise = require('bluebird');

// Send Notifications API
module.exports = function (data, recipient, options, callback) {
    // Keep track of instance 'this'
    var that = this;

    // Support empty options
    options = options || {};

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

        // Options must be an object
        if (Object.prototype.toString.call(options) !== '[object Object]') {
            return reject(new Error('Please provide the options parameter as an object.'));
        }

        // Prepare JSON post data (defaults to options object)
        var postData = options;

        // Set payload and device tokens
        postData.data = data;

        // Recipient provided as string?
        if (typeof recipient === 'string' || Array.isArray(recipient)) {
            // Set "to" parameter
            postData.to = recipient;
        }
        else {
            // Invalid recipient type
            return reject(new Error('Please provide the notification recipient as a string or an array of strings.'));
        }

        // Callback must be a function (if provided)
        if (callback && typeof callback !== 'function') {
            return reject(new Error('Please provide the callback parameter as a function.'));
        }

        // Make a request to the Send Notifications API
        request(
            Object.assign({
                uri: that.getApiEndpoint() + '/push?api_key=' + that.apiKey,
                method: 'POST',
                json: postData
            }, that.extraRequestOptions || {}), function (err, res, body) {
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