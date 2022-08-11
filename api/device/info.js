var axios = require('axios');

// Device Info API
module.exports = function (deviceToken, callback) {
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

        // Make a request to the Device Info API
        axios(
            Object.assign({
                url: that.getApiEndpoint() + '/devices/' + deviceToken + '?api_key=' + that.apiKey,
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
                var deviceInfo = body;

                // Callback?
                if (callback) {
                    // Invoke callback with device info result
                    callback(null, deviceInfo);
                }
                else {
                    // Resolve the promise
                    resolve(deviceInfo);
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