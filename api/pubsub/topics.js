var request = require('request');
var Promise = require('bluebird');

// Pub/Sub Topics API
module.exports = function (callback) {
    // Keep track of instance 'this'
    var that = this;

    // Always return a promise
    return new Promise(function (resolve, reject) {
        // Custom callback provided?
        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // Make a request to the Pub/Sub Topics API
        request(
            Object.assign({
                uri: that.getApiEndpoint() + '/topics/' + '?api_key=' + that.apiKey,
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
                var topics = body.topics;

                // Callback?
                if (callback) {
                    // Invoke callback with topics list
                    callback(null, topics);
                }
                else {
                    // Resolve the promise
                    resolve(body);
                }
            });
    });
}