var axios = require('axios');

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
        axios(
            Object.assign({
                url: that.getApiEndpoint() + '/topics/' + '?api_key=' + that.apiKey,
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