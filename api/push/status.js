var request = require('request');
var Promise = require('bluebird');

// Notification Status API
module.exports = function (pushId, callback) {
    // Keep track of instance 'this'
    var that = this;

    // Always return a promise
    return new Promise(function (resolve, reject) {
        // Custom callback provided?
        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // Device token passed in must be a string
        if (typeof pushId !== 'string') {
            return reject(new Error('Please provide the device token as a string.'));
        }

        // Make a request to the Notification Status API
        request(
            Object.assign({
                uri: that.getApiEndpoint() + '/pushes/' + pushId + '?api_key=' + that.apiKey,
                method: 'GET',
                json: true
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

                // Fetch result
                var status = body.push;

                // Callback?
                if (callback) {
                    // Invoke callback with notification status
                    callback(null, status);
                }
                else {
                    // Resolve the promise
                    resolve(status);
                }
            });
    });
}