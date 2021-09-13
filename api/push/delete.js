var request = require('request');
var Promise = require('bluebird')

// Notification Deletion API
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

        // No pushId provided?
        if (!pushId) {
            return reject(new Error('Please provide the notification ID you wish to delete.'));
        }

        // pushId must be an string
        if (typeof pushId !== 'string') {
            return reject(new Error('Please provide the notification ID as a string.'));
        }

        // Callback must be a function (if provided)
        if (callback && typeof callback !== 'function') {
            return reject(new Error('Please provide the callback parameter as a function.'));
        }

        // Make a request to the Notification Deletion API
        request(
            Object.assign({
                uri: that.getApiEndpoint() + '/pushes/' + pushId + '?api_key=' + that.apiKey,
                method: 'DELETE',
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

                // Callback?
                if (callback) {
                    // Invoke callback with a null error
                    callback(null);
                }
                else {
                    // Resolve the promise
                    resolve();
                }
            });
    });
};