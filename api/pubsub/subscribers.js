var axios = require('axios');

// Pub/Sub Subscribers API
module.exports = function (topic, callback) {
    // Keep track of instance 'this'
    var that = this;

    // Always return a promise
    return new Promise(function (resolve, reject) {
        // Custom callback provided?
        if (callback) {
            resolve = callback;
            reject = callback;
        }

        // Check the validity of topic
        if (!topic || typeof topic !== 'string') {
            return reject(new Error('Invalid topic name'));
        }

        // Make a request to the Pub/Sub Subscribers API
        axios(
            Object.assign({
                url: that.getApiEndpoint() + '/topics/' + topic + '?api_key=' + that.apiKey,
                method: 'GET',
                json: true
            }, that.extraRequestOptions || {})).then(function (res) {
                // API response
                var body = res.data;

                // Missing body?
                if (!body) {
                    return reject(new Error('An empty body was received from the Pushy API.'));
                }

                // Pushy error?
                if (body.error) {
                    return reject(new Error(body.error));
                }

                // Check for 200 OK
                if (res.status != 200) {
                    return reject(new Error('An invalid response code was received from the Pushy API.'));
                }

                // Fetch result
                var subscribers = body.subscribers;

                // Callback?
                if (callback) {
                    // Invoke callback with subscribers list
                    callback(null, subscribers);
                }
                else {
                    // Resolve the promise
                    resolve(body);
                }
            }).catch(function (err) {
                // Invoke callback/reject promise with Pushy error
                if (err.response && err.response.data) {
                    reject(err.response.data);
                }
                else {
                    reject(err);
                }
            });
    });
}