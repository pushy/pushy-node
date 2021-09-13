var request = require('request');
var Promise = require('bluebird');

// Pub/Sub Unsubscribe API
module.exports = function (topics, deviceToken, callback) {
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
        if (typeof deviceToken !== 'string') {
            return reject(new Error('Please provide the device token as a string.'));
        }

        // Topics passed in must be in string or array format
        if (typeof topics !== 'string' && !Array.isArray(topics)) {
            return reject(new Error('Please provide the Pub/Sub topics parameter as a string or an array of strings.'));
        }

        // Prepare JSON post data
        var postData = {};

        // Add token to the post body
        postData.token = deviceToken;

        // Convert singular string topic to array
        postData.topics = Array.isArray(topics) ? topics : [topics];

        // Make a request to the Pub/Sub Unsubscribe API
        request(
            Object.assign({
                uri: that.getApiEndpoint() + '/topics/unsubscribe/' + '?api_key=' + that.apiKey,
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

                // Callback?
                if (callback) {
                    // Pass null error (success)
                    callback(null);
                }
                else {
                    // Resolve the promise successfully
                    resolve();
                }
            });
    });
}